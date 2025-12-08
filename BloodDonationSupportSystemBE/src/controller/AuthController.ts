import { Request, Response } from 'express'
import CognitoService from '~/services/cognito.services'
import { UserService } from '~/services/user.services'
import { ResponseHandle } from '~/utils/Response'
import bcrypt from 'bcrypt'

interface LoginBody {
  email: string
  password: string
}

interface RegisterBody {
  email: string
  password: string
  confirm_password: string
  name: string
  date_of_birth: string
}

interface ConfirmBody {
  email: string
  code: string
}

interface ForgotPasswordBody {
  email: string
}

interface ResetPasswordBody {
  email: string
  code: string
  newPassword: string
}

class AuthController {
  private userService: UserService

  constructor() {
    this.userService = new UserService()
    this.login = this.login.bind(this)
    this.register = this.register.bind(this)
    this.confirmEmail = this.confirmEmail.bind(this)
    this.logout = this.logout.bind(this)
    this.forgotPassword = this.forgotPassword.bind(this)
    this.resetPassword = this.resetPassword.bind(this)
    this.getMe = this.getMe.bind(this)
  }

  /**
   * Login with Cognito
   */
  public async login(req: Request<{}, {}, LoginBody>, res: Response): Promise<any> {
    console.log('=== Cognito Login ===')
    console.log('Request body type:', typeof req.body)
    console.log('Request body:', JSON.stringify(req.body))

    // Handle case where body might be a string (from API Gateway)
    let body = req.body
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body)
      } catch (e) {
        console.log('Failed to parse body as JSON')
      }
    }

    const { email, password } = body as LoginBody

    if (!email || typeof email !== 'string' || email.trim() === '') {
      return res.status(400).json({ status: false, message: 'Email is required!' })
    }
    if (!password || typeof password !== 'string' || password.trim() === '') {
      return res.status(400).json({ status: false, message: 'Password is required!' })
    }

    try {
      // First, check if user exists in database
      const dbUser = await this.userService.findUserLogin(email)
      
      // Check if user is banned
      if (dbUser && dbUser.isDelete === false) {
        return ResponseHandle.responseError(res, null, 'Tài khoản của bạn đã bị khóa', 403)
      }

      // Try Cognito authentication first
      let cognitoResult = await CognitoService.signIn(email.trim(), password)

      // If Cognito fails with "user not found", try database auth and migrate
      if (!cognitoResult.success && cognitoResult.message.includes('Không tìm thấy tài khoản')) {
        console.log('User not in Cognito, trying database auth...')
        
        if (dbUser) {
          // Verify password with database
          const dbAuthResult = await this.userService.authUser({ email, password })
          
          if (dbAuthResult.success) {
            console.log('Database auth successful, migrating user to Cognito...')
            
            // Create user in Cognito
            try {
              const signUpResult = await CognitoService.adminCreateUser(
                email,
                password,
                dbUser.user_name || email,
                dbUser.user_role || 'member'
              )
              
              if (signUpResult.success) {
                // Try Cognito login again
                cognitoResult = await CognitoService.signIn(email.trim(), password)
              }
            } catch (migrateError) {
              console.error('Migration error:', migrateError)
            }
            
            // If Cognito still fails, return database auth result
            if (!cognitoResult.success) {
              return ResponseHandle.responseSuccess(
                res,
                {
                  user_id: dbAuthResult.data?.user_id,
                  user_name: dbAuthResult.data?.user_name,
                  user_role: dbAuthResult.data?.user_role,
                  email: email,
                  accessToken: null, // No Cognito token, frontend should handle this
                  migrated: false
                },
                `Xin chào, ${dbAuthResult.data?.user_name || email}`,
                200
              )
            }
          }
        }
      }

      if (!cognitoResult.success) {
        return ResponseHandle.responseError(res, null, cognitoResult.message, cognitoResult.statusCode)
      }

      // Return tokens in response body (not cookies) to avoid CORS issues
      return ResponseHandle.responseSuccess(
        res,
        {
          user_id: dbUser?.user_id || cognitoResult.data?.user?.sub,
          user_name: cognitoResult.data?.user?.name || dbUser?.user_name,
          user_role: cognitoResult.data?.user?.role || dbUser?.user_role || 'member',
          email: cognitoResult.data?.user?.email,
          accessToken: cognitoResult.data?.accessToken,
          idToken: cognitoResult.data?.idToken,
          refreshToken: cognitoResult.data?.refreshToken,
          expiresIn: cognitoResult.data?.expiresIn
        },
        `Xin chào, ${cognitoResult.data?.user?.name || email}`,
        200
      )
    } catch (error) {
      console.error('Login error:', error)
      return ResponseHandle.responseError(res, error, 'Đăng nhập thất bại', 500)
    }
  }

  /**
   * Register with Cognito
   */
  public async register(req: Request<{}, {}, RegisterBody>, res: Response): Promise<any> {
    console.log('=== Cognito Register ===')

    let body = req.body
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body)
      } catch (e) {
        console.log('Failed to parse body as JSON')
      }
    }

    const { email, password, confirm_password, name, date_of_birth } = body as RegisterBody

    if (!email || !password || !confirm_password || !name || !date_of_birth) {
      return ResponseHandle.responseError(res, null, 'Vui lòng điền đầy đủ thông tin', 400)
    }

    if (password !== confirm_password) {
      return ResponseHandle.responseError(res, null, 'Mật khẩu xác nhận không khớp', 400)
    }

    try {
      // Check if email exists in database
      const emailExists = await this.userService.checkEmailExists(email)
      if (emailExists) {
        return ResponseHandle.responseError(res, null, 'Email đã được sử dụng', 400)
      }

      // Register with Cognito
      const cognitoResult = await CognitoService.signUp(email, password, name)

      if (!cognitoResult.success) {
        return ResponseHandle.responseError(res, null, cognitoResult.message, cognitoResult.statusCode)
      }

      // Also create user in database
      const hashedPassword = await bcrypt.hash(password, 10)
      await this.userService.register({
        email,
        password: hashedPassword,
        name,
        date_of_birth
      })

      return ResponseHandle.responseSuccess(
        res,
        { email, requiresConfirmation: true },
        'Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.',
        201
      )
    } catch (error: any) {
      console.error('Register error:', error)
      return ResponseHandle.responseError(res, error, error.message || 'Đăng ký thất bại', 500)
    }
  }

  /**
   * Confirm email with verification code
   */
  public async confirmEmail(req: Request<{}, {}, ConfirmBody>, res: Response): Promise<any> {
    let body = req.body
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body)
      } catch (e) {}
    }

    const { email, code } = body as ConfirmBody

    if (!email || !code) {
      return ResponseHandle.responseError(res, null, 'Email và mã xác thực là bắt buộc', 400)
    }

    try {
      const result = await CognitoService.confirmSignUp(email, code)

      if (!result.success) {
        return ResponseHandle.responseError(res, null, result.message, result.statusCode)
      }

      return ResponseHandle.responseSuccess(res, null, 'Xác thực email thành công!', 200)
    } catch (error) {
      console.error('Confirm email error:', error)
      return ResponseHandle.responseError(res, error, 'Xác thực thất bại', 500)
    }
  }

  /**
   * Logout
   */
  public async logout(req: Request, res: Response): Promise<any> {
    try {
      // Get token from Authorization header
      const authHeader = req.headers.authorization
      const accessToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null

      if (accessToken) {
        await CognitoService.signOut(accessToken)
      }

      return ResponseHandle.responseSuccess(res, null, 'Đăng xuất thành công', 200)
    } catch (error) {
      console.error('Logout error:', error)
      return ResponseHandle.responseError(res, error, 'Đăng xuất thất bại', 500)
    }
  }

  /**
   * Forgot password
   */
  public async forgotPassword(req: Request<{}, {}, ForgotPasswordBody>, res: Response): Promise<any> {
    let body = req.body
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body)
      } catch (e) {}
    }

    const { email } = body as ForgotPasswordBody

    if (!email) {
      return ResponseHandle.responseError(res, null, 'Email là bắt buộc', 400)
    }

    try {
      const result = await CognitoService.forgotPassword(email)

      if (!result.success) {
        return ResponseHandle.responseError(res, null, result.message, result.statusCode)
      }

      return ResponseHandle.responseSuccess(res, null, 'Mã đặt lại mật khẩu đã được gửi đến email của bạn', 200)
    } catch (error) {
      console.error('Forgot password error:', error)
      return ResponseHandle.responseError(res, error, 'Gửi mã thất bại', 500)
    }
  }

  /**
   * Reset password with code
   */
  public async resetPassword(req: Request<{}, {}, ResetPasswordBody>, res: Response): Promise<any> {
    let body = req.body
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body)
      } catch (e) {}
    }

    const { email, code, newPassword } = body as ResetPasswordBody

    if (!email || !code || !newPassword) {
      return ResponseHandle.responseError(res, null, 'Vui lòng điền đầy đủ thông tin', 400)
    }

    try {
      const result = await CognitoService.confirmForgotPassword(email, code, newPassword)

      if (!result.success) {
        return ResponseHandle.responseError(res, null, result.message, result.statusCode)
      }

      return ResponseHandle.responseSuccess(res, null, 'Đặt lại mật khẩu thành công', 200)
    } catch (error) {
      console.error('Reset password error:', error)
      return ResponseHandle.responseError(res, error, 'Đặt lại mật khẩu thất bại', 500)
    }
  }

  /**
   * Get current user info
   */
  public async getMe(req: Request, res: Response): Promise<any> {
    try {
      // Get token from Authorization header
      const authHeader = req.headers.authorization
      const accessToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null

      if (!accessToken) {
        return ResponseHandle.responseError(res, null, 'Unauthorized', 401)
      }

      const userInfo = await CognitoService.getUserInfo(accessToken)

      if (!userInfo.email) {
        return ResponseHandle.responseError(res, null, 'Token không hợp lệ', 401)
      }

      // Get additional info from database
      const dbUser = await this.userService.findUserLogin(userInfo.email)
      const groups = await CognitoService.getUserGroups(userInfo.email)

      return ResponseHandle.responseSuccess(
        res,
        {
          user_id: dbUser?.user_id || userInfo.sub,
          email: userInfo.email,
          user_name: userInfo.name || dbUser?.user_name,
          user_role: groups[0] || dbUser?.user_role || 'member',
          ...dbUser
        },
        'Lấy thông tin thành công',
        200
      )
    } catch (error) {
      console.error('GetMe error:', error)
      return ResponseHandle.responseError(res, error, 'Lấy thông tin thất bại', 500)
    }
  }
}

export default AuthController

import { Request, Response } from 'express'
import { UserService } from '~/services/user.services'
import { ResponseHandle } from '~/utils/Response'
import bcrypt from 'bcrypt'
import { signToken, verifyToken } from '~/utils/jwt'
import ms from 'ms'

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
   * Login with Database + JWT
   */
  public async login(req: Request<{}, {}, LoginBody>, res: Response): Promise<any> {
    console.log('=== Database Login ===')

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
      // Check if user exists
      const user = await this.userService.findUserLogin(email)
      if (!user) {
        return ResponseHandle.responseError(res, null, 'Không tìm thấy tài khoản', 404)
      }

      // Check if user is banned
      if (user.isDelete === false) {
        return ResponseHandle.responseError(res, null, 'Tài khoản của bạn đã bị khóa', 403)
      }

      // Verify password
      const authResult = await this.userService.authUser({ email, password })
      if (!authResult.success) {
        return ResponseHandle.responseError(res, null, authResult.message, authResult.statusCode || 400)
      }

      // Generate JWT token
      const payload = {
        user_id: authResult.data?.user_id,
        user_name: authResult.data?.user_name,
        user_role: authResult.data?.user_role,
        email: email,
        token_type: 'access_token'
      }

      const expiresIn = process.env.ACCESS_TOKEN_EXPIRE_IN || '1d'
      const secret = (process.env.JWT_SECRET_ACCESS_TOKEN || process.env.JWT_SECRET) as string

      const accessToken = await signToken({
        payload,
        privateKey: secret,
        options: { algorithm: 'HS256', expiresIn }
      })

      console.log('Login successful for:', email)
      console.log('User role:', authResult.data?.user_role)

      return ResponseHandle.responseSuccess(
        res,
        {
          user_id: authResult.data?.user_id,
          user_name: authResult.data?.user_name,
          user_role: authResult.data?.user_role,
          email: email,
          accessToken: accessToken,
          expiresIn: typeof expiresIn === 'string' ? ms(expiresIn) / 1000 : 86400
        },
        `Xin chào, ${authResult.data?.user_name || email}`,
        200
      )
    } catch (error) {
      console.error('Login error:', error)
      return ResponseHandle.responseError(res, error, 'Đăng nhập thất bại', 500)
    }
  }

  /**
   * Register new user
   */
  public async register(req: Request<{}, {}, RegisterBody>, res: Response): Promise<any> {
    console.log('=== Database Register ===')

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
      // Check if email exists
      const emailExists = await this.userService.checkEmailExists(email)
      if (emailExists) {
        return ResponseHandle.responseError(res, null, 'Email đã được sử dụng', 400)
      }

      // Hash password and create user
      const hashedPassword = await bcrypt.hash(password, 10)
      const result = await this.userService.register({
        email,
        password: hashedPassword,
        name,
        date_of_birth
      })

      return ResponseHandle.responseSuccess(
        res,
        { email, requiresConfirmation: false },
        'Đăng ký thành công!',
        201
      )
    } catch (error: any) {
      console.error('Register error:', error)
      return ResponseHandle.responseError(res, error, error.message || 'Đăng ký thất bại', 500)
    }
  }

  /**
   * Confirm email (placeholder - not needed without Cognito)
   */
  public async confirmEmail(req: Request, res: Response): Promise<any> {
    return ResponseHandle.responseSuccess(res, null, 'Email đã được xác thực', 200)
  }

  /**
   * Logout
   */
  public async logout(req: Request, res: Response): Promise<any> {
    try {
      res.clearCookie('token', { httpOnly: true })
      return ResponseHandle.responseSuccess(res, null, 'Đăng xuất thành công', 200)
    } catch (error) {
      console.error('Logout error:', error)
      return ResponseHandle.responseError(res, error, 'Đăng xuất thất bại', 500)
    }
  }

  /**
   * Forgot password (placeholder)
   */
  public async forgotPassword(req: Request, res: Response): Promise<any> {
    return ResponseHandle.responseError(res, null, 'Chức năng đang được phát triển', 501)
  }

  /**
   * Reset password (placeholder)
   */
  public async resetPassword(req: Request, res: Response): Promise<any> {
    return ResponseHandle.responseError(res, null, 'Chức năng đang được phát triển', 501)
  }

  /**
   * Get current user info from JWT token
   */
  public async getMe(req: Request, res: Response): Promise<any> {
    try {
      const authHeader = req.headers.authorization
      const accessToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null

      if (!accessToken) {
        return ResponseHandle.responseError(res, null, 'Unauthorized', 401)
      }

      // Verify JWT token
      const secret = (process.env.JWT_SECRET_ACCESS_TOKEN || process.env.JWT_SECRET) as string
      let decoded: any

      try {
        decoded = await verifyToken({ token: accessToken, privateKey: secret })
      } catch (err) {
        return ResponseHandle.responseError(res, null, 'Token không hợp lệ hoặc đã hết hạn', 401)
      }

      // Get fresh user data from database
      const dbUser = await this.userService.findUserLogin(decoded.email)
      if (!dbUser) {
        return ResponseHandle.responseError(res, null, 'Không tìm thấy người dùng', 404)
      }

      return ResponseHandle.responseSuccess(
        res,
        {
          ...dbUser,
          user_role: dbUser.user_role
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

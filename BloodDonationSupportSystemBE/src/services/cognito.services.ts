import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  SignUpCommand,
  ConfirmSignUpCommand,
  AdminGetUserCommand,
  AdminAddUserToGroupCommand,
  AdminListGroupsForUserCommand,
  GlobalSignOutCommand,
  GetUserCommand,
  ForgotPasswordCommand,
  ConfirmForgotPasswordCommand,
  AdminCreateUserCommand,
  AdminSetUserPasswordCommand
} from '@aws-sdk/client-cognito-identity-provider'
import dotenv from 'dotenv'

dotenv.config()

const REGION = process.env.AWS_REGION || 'ap-southeast-1'
const USER_POOL_ID = process.env.COGNITO_USER_POOL_ID || ''
const CLIENT_ID = process.env.COGNITO_CLIENT_ID || ''

const cognitoClient = new CognitoIdentityProviderClient({ region: REGION })

export interface CognitoAuthResult {
  success: boolean
  message: string
  statusCode: number
  data?: {
    accessToken?: string
    idToken?: string
    refreshToken?: string
    expiresIn?: number
    user?: {
      email: string
      name?: string
      role?: string
      sub?: string
    }
  }
}

export class CognitoService {
  /**
   * Sign up a new user
   */
  async signUp(email: string, password: string, name: string): Promise<CognitoAuthResult> {
    try {
      const command = new SignUpCommand({
        ClientId: CLIENT_ID,
        Username: email,
        Password: password,
        UserAttributes: [
          { Name: 'email', Value: email },
          { Name: 'name', Value: name }
        ]
      })

      const response = await cognitoClient.send(command)

      return {
        success: true,
        message: 'User registered successfully. Please check your email for verification code.',
        statusCode: 201,
        data: {
          user: {
            email,
            name,
            sub: response.UserSub
          }
        }
      }
    } catch (error: any) {
      console.error('Cognito SignUp Error:', error)
      return {
        success: false,
        message: error.message || 'Registration failed',
        statusCode: error.$metadata?.httpStatusCode || 400
      }
    }
  }

  /**
   * Confirm user registration with verification code
   */
  async confirmSignUp(email: string, code: string): Promise<CognitoAuthResult> {
    try {
      const command = new ConfirmSignUpCommand({
        ClientId: CLIENT_ID,
        Username: email,
        ConfirmationCode: code
      })

      await cognitoClient.send(command)

      // Add user to 'member' group by default
      await this.addUserToGroup(email, 'member')

      return {
        success: true,
        message: 'Email verified successfully',
        statusCode: 200
      }
    } catch (error: any) {
      console.error('Cognito ConfirmSignUp Error:', error)
      return {
        success: false,
        message: error.message || 'Verification failed',
        statusCode: error.$metadata?.httpStatusCode || 400
      }
    }
  }

  /**
   * Sign in user with email and password
   */
  async signIn(email: string, password: string): Promise<CognitoAuthResult> {
    try {
      const command = new InitiateAuthCommand({
        AuthFlow: 'USER_PASSWORD_AUTH',
        ClientId: CLIENT_ID,
        AuthParameters: {
          USERNAME: email,
          PASSWORD: password
        }
      })

      const response = await cognitoClient.send(command)

      if (!response.AuthenticationResult) {
        return {
          success: false,
          message: 'Authentication failed',
          statusCode: 401
        }
      }

      // Get user groups (role)
      const userGroups = await this.getUserGroups(email)
      const role = userGroups.length > 0 ? userGroups[0] : 'member'

      // Get user attributes
      const userInfo = await this.getUserInfo(response.AuthenticationResult.AccessToken!)

      return {
        success: true,
        message: 'Login successful',
        statusCode: 200,
        data: {
          accessToken: response.AuthenticationResult.AccessToken,
          idToken: response.AuthenticationResult.IdToken,
          refreshToken: response.AuthenticationResult.RefreshToken,
          expiresIn: response.AuthenticationResult.ExpiresIn,
          user: {
            email: userInfo.email || email,
            name: userInfo.name,
            role,
            sub: userInfo.sub
          }
        }
      }
    } catch (error: any) {
      console.error('Cognito SignIn Error:', error)

      let message = 'Login failed'
      if (error.name === 'NotAuthorizedException') {
        message = 'Email hoặc mật khẩu không đúng'
      } else if (error.name === 'UserNotConfirmedException') {
        message = 'Tài khoản chưa được xác thực. Vui lòng kiểm tra email.'
      } else if (error.name === 'UserNotFoundException') {
        message = 'Không tìm thấy tài khoản'
      }

      return {
        success: false,
        message,
        statusCode: error.$metadata?.httpStatusCode || 401
      }
    }
  }

  /**
   * Sign out user globally
   */
  async signOut(accessToken: string): Promise<CognitoAuthResult> {
    try {
      const command = new GlobalSignOutCommand({
        AccessToken: accessToken
      })

      await cognitoClient.send(command)

      return {
        success: true,
        message: 'Logged out successfully',
        statusCode: 200
      }
    } catch (error: any) {
      console.error('Cognito SignOut Error:', error)
      return {
        success: false,
        message: error.message || 'Logout failed',
        statusCode: error.$metadata?.httpStatusCode || 400
      }
    }
  }

  /**
   * Get user info from access token
   */
  async getUserInfo(accessToken: string): Promise<{ email?: string; name?: string; sub?: string }> {
    try {
      const command = new GetUserCommand({
        AccessToken: accessToken
      })

      const response = await cognitoClient.send(command)

      const attributes: { [key: string]: string } = {}
      response.UserAttributes?.forEach((attr: { Name?: string; Value?: string }) => {
        if (attr.Name && attr.Value) {
          attributes[attr.Name] = attr.Value
        }
      })

      return {
        email: attributes['email'],
        name: attributes['name'],
        sub: attributes['sub']
      }
    } catch (error) {
      console.error('GetUserInfo Error:', error)
      return {}
    }
  }

  /**
   * Get user groups (roles)
   */
  async getUserGroups(email: string): Promise<string[]> {
    try {
      const command = new AdminListGroupsForUserCommand({
        UserPoolId: USER_POOL_ID,
        Username: email
      })

      const response = await cognitoClient.send(command)

      return response.Groups?.map((g: { GroupName?: string }) => g.GroupName || '').filter(Boolean) || []
    } catch (error) {
      console.error('GetUserGroups Error:', error)
      return []
    }
  }

  /**
   * Add user to a group
   */
  async addUserToGroup(email: string, groupName: string): Promise<boolean> {
    try {
      const command = new AdminAddUserToGroupCommand({
        UserPoolId: USER_POOL_ID,
        Username: email,
        GroupName: groupName
      })

      await cognitoClient.send(command)
      return true
    } catch (error) {
      console.error('AddUserToGroup Error:', error)
      return false
    }
  }

  /**
   * Forgot password - send reset code
   */
  async forgotPassword(email: string): Promise<CognitoAuthResult> {
    try {
      const command = new ForgotPasswordCommand({
        ClientId: CLIENT_ID,
        Username: email
      })

      await cognitoClient.send(command)

      return {
        success: true,
        message: 'Password reset code sent to your email',
        statusCode: 200
      }
    } catch (error: any) {
      console.error('ForgotPassword Error:', error)
      return {
        success: false,
        message: error.message || 'Failed to send reset code',
        statusCode: error.$metadata?.httpStatusCode || 400
      }
    }
  }

  /**
   * Confirm forgot password with code and new password
   */
  async confirmForgotPassword(email: string, code: string, newPassword: string): Promise<CognitoAuthResult> {
    try {
      const command = new ConfirmForgotPasswordCommand({
        ClientId: CLIENT_ID,
        Username: email,
        ConfirmationCode: code,
        Password: newPassword
      })

      await cognitoClient.send(command)

      return {
        success: true,
        message: 'Password reset successfully',
        statusCode: 200
      }
    } catch (error: any) {
      console.error('ConfirmForgotPassword Error:', error)
      return {
        success: false,
        message: error.message || 'Failed to reset password',
        statusCode: error.$metadata?.httpStatusCode || 400
      }
    }
  }

  /**
   * Admin create user (for staff accounts)
   */
  async adminCreateUser(email: string, password: string, name: string, role: string): Promise<CognitoAuthResult> {
    try {
      // Create user
      const createCommand = new AdminCreateUserCommand({
        UserPoolId: USER_POOL_ID,
        Username: email,
        UserAttributes: [
          { Name: 'email', Value: email },
          { Name: 'name', Value: name },
          { Name: 'email_verified', Value: 'true' }
        ],
        MessageAction: 'SUPPRESS' // Don't send welcome email
      })

      await cognitoClient.send(createCommand)

      // Set permanent password
      const setPasswordCommand = new AdminSetUserPasswordCommand({
        UserPoolId: USER_POOL_ID,
        Username: email,
        Password: password,
        Permanent: true
      })

      await cognitoClient.send(setPasswordCommand)

      // Add to group
      await this.addUserToGroup(email, role)

      return {
        success: true,
        message: `User created with role: ${role}`,
        statusCode: 201,
        data: {
          user: { email, name, role }
        }
      }
    } catch (error: any) {
      console.error('AdminCreateUser Error:', error)
      return {
        success: false,
        message: error.message || 'Failed to create user',
        statusCode: error.$metadata?.httpStatusCode || 400
      }
    }
  }
}

export default new CognitoService()

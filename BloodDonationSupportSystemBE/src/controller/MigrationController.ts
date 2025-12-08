import { Request, Response } from 'express'
import CognitoService from '~/services/cognito.services'
import { UserService } from '~/services/user.services'
import { ResponseHandle } from '~/utils/Response'
import DatabaseServices from '~/services/database.services'

class MigrationController {
  private userService: UserService

  constructor() {
    this.userService = new UserService()
    this.migrateUsers = this.migrateUsers.bind(this)
    this.listUsers = this.listUsers.bind(this)
  }

  /**
   * List all users from database
   */
  public async listUsers(req: Request, res: Response): Promise<any> {
    try {
      const users = await DatabaseServices.query(
        'SELECT User_ID, Email, User_Name, User_Role, isDelete FROM users LIMIT 100'
      )

      return ResponseHandle.responseSuccess(res, users, 'Users retrieved', 200)
    } catch (error) {
      console.error('List users error:', error)
      return ResponseHandle.responseError(res, error, 'Failed to list users', 500)
    }
  }

  /**
   * Migrate users from database to Cognito
   */
  public async migrateUsers(req: Request, res: Response): Promise<any> {
    try {
      // Get all active users from database
      const users = await DatabaseServices.query(
        'SELECT User_ID, Email, User_Name, User_Role, Password FROM users WHERE isDelete = 1 OR isDelete IS NULL'
      )

      const results = {
        total: users.length,
        success: 0,
        failed: 0,
        skipped: 0,
        details: [] as any[]
      }

      for (const user of users) {
        try {
          // Check if user already exists in Cognito
          const existingGroups = await CognitoService.getUserGroups(user.Email)
          
          if (existingGroups.length > 0) {
            results.skipped++
            results.details.push({
              email: user.Email,
              status: 'skipped',
              reason: 'Already exists in Cognito'
            })
            continue
          }

          // Create user in Cognito with a temporary password
          // Users will need to reset their password on first login
          const tempPassword = 'TempPass123!' // Temporary password
          const role = user.User_Role || 'member'

          const createResult = await CognitoService.adminCreateUser(
            user.Email,
            tempPassword,
            user.User_Name || user.Email,
            role
          )

          if (createResult.success) {
            results.success++
            results.details.push({
              email: user.Email,
              status: 'success',
              role: role
            })
          } else {
            results.failed++
            results.details.push({
              email: user.Email,
              status: 'failed',
              reason: createResult.message
            })
          }
        } catch (userError: any) {
          results.failed++
          results.details.push({
            email: user.Email,
            status: 'failed',
            reason: userError.message
          })
        }
      }

      return ResponseHandle.responseSuccess(res, results, 'Migration completed', 200)
    } catch (error) {
      console.error('Migration error:', error)
      return ResponseHandle.responseError(res, error, 'Migration failed', 500)
    }
  }

  /**
   * Migrate a single user by email
   */
  public async migrateSingleUser(req: Request, res: Response): Promise<any> {
    const { email, password } = req.body

    if (!email) {
      return ResponseHandle.responseError(res, null, 'Email is required', 400)
    }

    try {
      // Get user from database
      const users = await DatabaseServices.query(
        'SELECT User_ID, Email, User_Name, User_Role FROM users WHERE Email = ?',
        [email]
      )

      if (!users || users.length === 0) {
        return ResponseHandle.responseError(res, null, 'User not found in database', 404)
      }

      const user = users[0]
      const role = user.User_Role || 'member'
      const userPassword = password || 'TempPass123!'

      const createResult = await CognitoService.adminCreateUser(
        user.Email,
        userPassword,
        user.User_Name || user.Email,
        role
      )

      if (createResult.success) {
        return ResponseHandle.responseSuccess(res, {
          email: user.Email,
          role: role,
          message: 'User migrated successfully'
        }, 'Migration successful', 200)
      } else {
        return ResponseHandle.responseError(res, null, createResult.message, 400)
      }
    } catch (error) {
      console.error('Single user migration error:', error)
      return ResponseHandle.responseError(res, error, 'Migration failed', 500)
    }
  }
}

export default MigrationController

import { Router } from 'express'
import AuthController from '~/controller/AuthController'
import MigrationController from '~/controller/MigrationController'

const router = Router()
const authController = new AuthController()
const migrationController = new MigrationController()

// Cognito Authentication Routes
router.post('/login', authController.login)
router.post('/register', authController.register)
router.post('/confirm-email', authController.confirmEmail)
router.post('/logout', authController.logout)
router.post('/forgot-password', authController.forgotPassword)
router.post('/reset-password', authController.resetPassword)
router.get('/me', authController.getMe)

// Migration Routes (temporary - remove after migration)
router.get('/migrate/list-users', migrationController.listUsers)
router.post('/migrate/all', migrationController.migrateUsers)
router.post('/migrate/single', migrationController.migrateSingleUser)

export default router

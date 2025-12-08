import { Router } from 'express'
import AuthController from '~/controller/AuthController'

const router = Router()
const authController = new AuthController()

// Cognito Authentication Routes
router.post('/login', authController.login)
router.post('/register', authController.register)
router.post('/confirm-email', authController.confirmEmail)
router.post('/logout', authController.logout)
router.post('/forgot-password', authController.forgotPassword)
router.post('/reset-password', authController.resetPassword)
router.get('/me', authController.getMe)

export default router

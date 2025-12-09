import { Router } from 'express'
import AuthController from '~/controller/AuthController'

const router = Router()
const authController = new AuthController()

// Authentication Routes (Database + JWT)
router.post('/login', authController.login)
router.post('/signup', authController.register)  // Frontend calls /signup
router.post('/register', authController.register) // Keep for compatibility
router.post('/confirm-email', authController.confirmEmail)
router.post('/logout', authController.logout)
router.post('/auth/forgot-password', authController.forgotPassword)
router.post('/auth/reset-password', authController.resetPassword)
router.get('/getMe', authController.getMe)  // Frontend calls /getMe
router.get('/me', authController.getMe)     // Keep for compatibility

export default router

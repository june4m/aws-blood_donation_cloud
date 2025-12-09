import { RequestHandler } from 'express'
import jwt, { JwtPayload, TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken'
import dotenv from 'dotenv'
import { TokenPayLoad } from '~/models/schemas/requests/user.requests'

dotenv.config()

// Middleware xác thực JWT
export const verifyToken: RequestHandler = (req, res, next) => {
  // Lấy token từ cookie hoặc header Authorization
  let token = req.cookies?.token

  // Nếu không có trong cookie, kiểm tra header Authorization
  if (!token) {
    const authHeader = req.headers.authorization
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7)
    }
  }

  if (!token) {
    res.status(401).json({ success: false, message: 'No token provided' })
    return
  }

  try {
    const secret = process.env.JWT_SECRET_ACCESS_TOKEN || process.env.JWT_SECRET!
    const decoded = jwt.verify(token, secret) as JwtPayload
    req.user = decoded as TokenPayLoad
    next()
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      res.status(401).json({ success: false, message: 'Token expired' })
      return
    }
    if (err instanceof JsonWebTokenError) {
      res.status(401).json({ success: false, message: 'Invalid token' })
      return
    }
    res.status(401).json({ success: false, message: 'Token verification failed' })
    return
  }
}

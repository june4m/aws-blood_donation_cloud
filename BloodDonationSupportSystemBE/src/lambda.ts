import serverless from 'serverless-http'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import router from './routers/users.routers'
import emailRouter from './routers/email.routers'

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// Routes - support both with and without /dev prefix (API Gateway stage)
app.use('/api', router)
app.use('/dev/api', router)
app.use('/email', emailRouter)
app.use('/dev/email', emailRouter)

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() })
})
app.get('/dev/health', (_req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() })
})

// Export handler for Lambda with request transformation
export const handler = serverless(app, {
  request: (request: any, event: any) => {
    if (event.isBase64Encoded && event.body) {
      request.body = Buffer.from(event.body, 'base64').toString('utf8')
    }
  }
})

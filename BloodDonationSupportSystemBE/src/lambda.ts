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
app.use(cookieParser())

// Routes
app.use('/api', router)
app.use('/email', emailRouter)

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() })
})

// Export handler for Lambda
export const handler = serverless(app)

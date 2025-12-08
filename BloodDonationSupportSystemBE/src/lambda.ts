import serverless from 'serverless-http'
import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import router from './routers/users.routers'
import emailRouter from './routers/email.routers'

const app = express()

// Middleware
app.use(cors())

// Custom body parser for Lambda - parse JSON string body from API Gateway
app.use((req: Request, _res: Response, next: NextFunction) => {
  // If body is a string (from API Gateway), parse it
  if (req.body && typeof req.body === 'string') {
    try {
      req.body = JSON.parse(req.body)
    } catch (e) {
      // Not valid JSON, leave as is
    }
  }
  next()
})

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

// Wrapper handler to pre-process event body
const serverlessHandler = serverless(app, {
  request: (request: any, event: any) => {
    // Pass the original event body to request for debugging
    request.lambdaEvent = event
  }
})

export const handler = async (event: any, context: any) => {
  // Log incoming event for debugging
  console.log('Lambda event:', JSON.stringify({
    path: event.rawPath || event.path,
    method: event.requestContext?.http?.method || event.httpMethod,
    bodyType: typeof event.body,
    isBase64Encoded: event.isBase64Encoded,
    bodyPreview: event.body ? event.body.substring(0, 200) : null
  }))

  // Pre-process body before passing to serverless-http
  if (event.body) {
    if (event.isBase64Encoded) {
      event.body = Buffer.from(event.body, 'base64').toString('utf8')
      event.isBase64Encoded = false
    }
  }
  
  return serverlessHandler(event, context)
}

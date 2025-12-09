import serverless from 'serverless-http'
import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import router from './routers/users.routers'
import emailRouter from './routers/email.routers'
import authRouter from './routers/auth.routers'

const app = express()

// CORS configuration for credentials (cookies)
const allowedOrigins = [
  'https://main.d1fnooytkqycdg.amplifyapp.com',
  'https://main.d1ag7fwsuhqivq.amplifyapp.com',
  'http://localhost:5173',
  'http://localhost:3000'
]

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true)
      if (allowedOrigins.includes(origin)) {
        return callback(null, origin)
      }
      return callback(null, allowedOrigins[0]) // Default to first allowed origin
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  })
)

// Custom body parser for Lambda - parse body from API Gateway
app.use((req: Request, _res: Response, next: NextFunction) => {
  // Handle Buffer object (from serverless-http)
  if (req.body && typeof req.body === 'object' && req.body.type === 'Buffer' && Array.isArray(req.body.data)) {
    try {
      const bodyString = Buffer.from(req.body.data).toString('utf8')
      req.body = JSON.parse(bodyString)
      console.log('Parsed Buffer body:', JSON.stringify(req.body))
    } catch (e) {
      console.log('Failed to parse Buffer body')
    }
  }
  // If body is a string (from API Gateway), parse it
  else if (req.body && typeof req.body === 'string') {
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
// Mount both API and Auth routes under /api for simplicity
app.use('/api', router)
app.use('/api', authRouter)
app.use('/dev/api', router)
app.use('/dev/api', authRouter)
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
  request: (request: any, event: any, context: any) => {
    // Pass the original event body to request
    request.lambdaEvent = event
    
    // If body is a string, parse it and set to request.body
    if (event.body && typeof event.body === 'string') {
      try {
        request.body = JSON.parse(event.body)
        console.log('Set parsed body in serverless request:', JSON.stringify(request.body))
      } catch (e) {
        // Not JSON
      }
    }
  }
})

export const handler = async (event: any, context: any) => {
  // Log incoming event for debugging
  console.log('Lambda event:', JSON.stringify({
    path: event.rawPath || event.path,
    method: event.requestContext?.http?.method || event.httpMethod,
    bodyType: typeof event.body,
    isBase64Encoded: event.isBase64Encoded,
    bodyPreview: event.body ? (typeof event.body === 'string' ? event.body.substring(0, 200) : 'non-string') : null
  }))

  // Pre-process body before passing to serverless-http
  if (event.body) {
    // Decode base64 if needed
    if (event.isBase64Encoded) {
      event.body = Buffer.from(event.body, 'base64').toString('utf8')
      event.isBase64Encoded = false
    }
    
    // Parse JSON string body
    if (typeof event.body === 'string') {
      try {
        // Store parsed body for later use
        const parsedBody = JSON.parse(event.body)
        console.log('Parsed body in handler:', JSON.stringify(parsedBody))
      } catch (e) {
        // Not JSON, leave as is
      }
    }
  }
  
  return serverlessHandler(event, context)
}

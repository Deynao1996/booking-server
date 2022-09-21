import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import cookieSession from 'cookie-session'
import cors from 'cors'
import passport from 'passport'
import authRouter from './routes/auth.js'
import hotelsRouter from './routes/hotels.js'
import roomsRouter from './routes/rooms.js'
import usersRouter from './routes/users.js'
import stripeRouter from './routes/stripe.js'
import orderRouter from './routes/order.js'
import passportRouter from './routes/passport.js'
import resetPasswordRouter from './routes/resetPassword.js'
import { handleErrors } from './middlewares/handleErrors.js'
import { configPassport } from './configPassport.js'

dotenv.config()
const app = express()

const connectToDataBase = async () => {
  try {
    await mongoose.connect(process.env.MONGO)
    console.log('Connected to MongoDB')
  } catch (error) {
    throw error
  }
}

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: 'GET, POST, DELETE, PUT',
    credentials: true
  })
)
app.use(
  cookieSession({
    name: 'session',
    keys: ['booking'],
    maxAge: Number(process.env.SESSION_MAX_AGE)
  })
)
app.use(passport.initialize())
app.use(passport.session())
app.use(
  '/api/payment/webhook',
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf.toString()
    }
  })
)
app.use(cookieParser())
app.use(express.json())
configPassport()

app.use('/api/auth', authRouter)
app.use('/api/hotels', hotelsRouter)
app.use('/api/rooms', roomsRouter)
app.use('/api/users', usersRouter)
app.use('/api/order', orderRouter)
app.use('/api/payment', stripeRouter)
app.use('/api/reset-password', resetPasswordRouter)
app.use('/api/passport', passportRouter)

app.use(handleErrors())

app.listen(8800, () => {
  connectToDataBase()
  console.log('Connected to Server')
})

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
import statsRouter from './routes/stats.js'
import orderRouter from './routes/order.js'
import notificationsRouter from './routes/notifications.js'
import passportRouter from './routes/passport.js'
import resetPasswordRouter from './routes/resetPassword.js'
import { handleErrors } from './middlewares/handleErrors.js'
import { configPassport } from './configPassport.js'
import cron from 'node-cron'
import Order from './models/Order.js'
import Room from './models/Room.js'
import User from './models/User.js'
import Hotel from './models/Hotel.js'

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

const whitelist = [
  process.env.CLIENT_URL,
  process.env.DASHBOARD_URL,
  'http://192.168.1.102:3000'
]

app.use(
  cors({
    origin: whitelist,
    methods: 'GET, POST, DELETE, PUT',
    credentials: true
  })
)

app.set('trust proxy', 1)

app.use(
  cookieSession({
    name: 'session',
    keys: ['booking'],
    maxAge: Number(process.env.SESSION_MAX_AGE),
    sameSite: 'none',
    secure: true
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
app.use('/api/orders', orderRouter)
app.use('/api/payment', stripeRouter)
app.use('/api/stats', statsRouter)
app.use('/api/notifications', notificationsRouter)
app.use('/api/reset-password', resetPasswordRouter)
app.use('/api/passport', passportRouter)

app.use(handleErrors())

cron.schedule('0 0 */2 * * *', async () => {
  if (process.env.APP_STATUS === 'demo') {
    try {
      const [deletedOrders, deletedRooms, deletedUsers, deletedHotels] =
        await Promise.all([
          Order.deleteMany({ isTest: true }),
          Room.deleteMany({ isTest: true }),
          User.deleteMany({ isTest: true }),
          Hotel.deleteMany({ isTest: true })
        ])
      console.log(
        `Deleted ${deletedOrders.deletedCount} test orders, ` +
          `${deletedRooms.deletedCount} test rooms, ` +
          `${deletedUsers.deletedCount} test users, ` +
          `${deletedHotels.deletedCount} test hotels`
      )
    } catch (error) {
      console.error('Error:', error)
    }
  }
})

app.listen(8800, () => {
  connectToDataBase()
  console.log('Connected to Server')
})

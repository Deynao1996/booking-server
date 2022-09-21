import express from 'express'
import {
  loginUser,
  registerUser,
  verifyAuthToken,
  loginWithJWT
} from '../controllers/authController.js'
import { verifyToken } from '../utils/verifyToken.js'

const router = express.Router()

router.post('/register', registerUser)

router.post('/login', loginUser)

router.get('/:id/verify/:token', verifyAuthToken)

router.get('/login/with-jwt', verifyToken('session_token'), loginWithJWT)

router.get('/logout', (_req, res) =>
  res.clearCookie('access_token').clearCookie('session_token').end()
)

export default router

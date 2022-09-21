import express from 'express'
import passport from 'passport'
import {
  passportCallback,
  loginFailed
} from '../controllers/passportController.js'

const router = express.Router()

router.get(
  '/google',
  passport.authenticate('google', {
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ]
  })
)

router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: '/login/failed',
    failureMessage: true
  }),
  passportCallback
)

router.get(
  '/github',
  passport.authenticate('github', { scope: ['user:email'] })
)

router.get(
  '/github/callback',
  passport.authenticate('github', {
    failureRedirect: '/login/failed',
    failureMessage: true,
    session: false
  }),
  passportCallback
)

router.get('/login/failed', loginFailed)

export default router

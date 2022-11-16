import { createError } from '../utils/error.js'
import jwt from 'jsonwebtoken'

export const passportCallback = (req, res, _next) => {
  const {
    _id,
    isAdmin,
    userName,
    email,
    hasNewsletter,
    photo,
    isVerified,
    name = '',
    lastName = ''
  } = req.user.result
  const accessToken = jwt.sign({ id: _id, isAdmin }, process.env.JWT)
  const sessionToken = jwt.sign(
    {
      _id,
      userName,
      email,
      hasNewsletter,
      photo,
      isVerified,
      name,
      lastName
    },
    process.env.JWT,
    { expiresIn: Number(process.env.SESSION_MAX_AGE) }
  )

  res
    .cookie('session_token', sessionToken, { httpOnly: true })
    .cookie('access_token', accessToken, { httpOnly: true })
    .redirect(302, process.env.CLIENT_URL)
}

export const loginFailed = (_req, _res, next) =>
  next(createError(401, 'Login process failed!'))

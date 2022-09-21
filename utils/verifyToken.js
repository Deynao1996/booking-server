import jwt from 'jsonwebtoken'
import { createError } from './error.js'

// export const verifyToken = (req, res, next) => {
//   const token = req.cookies.auth_token
//   if (!token) return next(createError(401, 'You are not authenticated!'))

//   jwt.verify(token, process.env.JWT, (err, user) => {
//     if (err) return next(createError(403, 'Token is not valid!'))
//     req.user = user
//     next()
//   })
// }

export const verifyToken = (type) => (req, res, next) => {
  const token = req.cookies[type]
  if (!token && type === 'access_token') {
    return next(createError(401, 'You are not authenticated!'))
  } else if (!token && type === 'session_token') {
    return next(createError(401, 'Your session has expired. Please log in!'))
  }

  jwt.verify(token, process.env.JWT, (err, user) => {
    if (user instanceof Error) next(createError(user.status, user.message))
    if (err) return next(createError(403, 'Token is not valid!'))
    req.user = user
    next()
  })
}

export const verifyUser = (req, res, next) => {
  verifyToken('auth_token')(req, res, next, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next()
    } else {
      return next(createError(403, 'You are not authorized!'))
    }
  })
}

export const verifyAdmin = (req, res, next) => {
  verifyToken('auth_token')(req, res, next, () => {
    if (req.user.isAdmin) {
      next()
    } else {
      return next(createError(403, 'You are not authorized!'))
    }
  })
}

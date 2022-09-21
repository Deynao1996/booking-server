import AuthToken from '../models/AuthToken.js'
import crypto from 'crypto'

export const createAuthToken = (user) => {
  return new AuthToken({
    userId: user._id,
    token: crypto.randomBytes(32).toString('hex')
  })
}

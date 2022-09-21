import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import AuthToken from '../models/AuthToken.js'
import { createError } from '../utils/error.js'
import { sendEmail } from '../utils/sendEmail.js'
import { createAuthToken } from '../utils/createAuthToken.js'

export const sendPasswordLink = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email })
    if (!user)
      return next(createError(409, 'User with given email does not exist!'))
    if (user.passportId)
      return next(
        createError(
          409,
          'You cannot change a password because you signed in from external link!'
        )
      )

    let token = await AuthToken.findOne({ userId: user._id })
    if (!token) {
      token = await createAuthToken(user).save()
      const url = `${process.env.CLIENT_URL}/auth/reset-password/${user._id}/${token.token}`
      await sendEmail({
        email: user.email,
        subject: 'You receive an email with a link to reset your old password!',
        text: url
      })
    }

    res
      .status(200)
      .json('Password reset link has been already sent your email account!')
  } catch (error) {
    next(error)
  }
}

export const verifyLink = async (req, res, next) => {
  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    return next(createError(400, 'Invalid link'))
  }
  try {
    const user = await User.findOne({ _id: req.params.id })
    if (!user) return next(createError(400, 'Invalid link'))

    const token = await AuthToken.findOne({
      userId: user._id,
      token: req.params.token
    })
    if (!token) return next(createError(400, 'Invalid link'))

    res.status(200).json('You have been verified! Please pass a new password')
  } catch (error) {
    next(error)
  }
}

export const setNewPassword = async (req, res, next) => {
  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    return next(createError(400, 'Invalid link'))
  }
  try {
    const user = await User.findOne({ _id: req.params.id })
    if (!user) return next(createError(404, 'User not found!'))

    const token = await AuthToken.findOne({
      userId: user._id,
      token: req.params.token
    })
    if (!token) return next(createError(400, 'Invalid link'))

    if (!user.isVerified) user.isVerified = true

    const salt = bcrypt.genSaltSync(10)
    const hashPassword = bcrypt.hashSync(req.body.password, salt)

    user.password = hashPassword
    await user.save()
    await token.remove()

    res.status(200).json('Password reset successfully!')
  } catch (error) {
    next(error)
  }
}

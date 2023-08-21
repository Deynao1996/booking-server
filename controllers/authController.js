import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import AuthToken from '../models/AuthToken.js'
import { createError } from '../utils/error.js'
import { sendEmail } from '../utils/sendEmail.js'
import { createAuthToken } from '../utils/createAuthToken.js'

export const registerUser = async (req, res, next) => {
  const { userName, email, lastName, name, password } = req.body
  const salt = bcrypt.genSaltSync(10)
  const hash = bcrypt.hashSync(password, salt)
  const newUser = new User({
    userName: userName,
    email: email,
    lastName: lastName,
    name: name,
    password: hash
  })

  try {
    const isUserNameExist = await User.exists({ userName })
    if (isUserNameExist)
      return next(createError(409, `${userName} is already exist!`))

    const isEmailExist = await User.exists({ email })
    if (isEmailExist)
      return next(createError(409, `${email} is already exist!`))

    const createdUser = await newUser.save()

    const authToken = await createAuthToken(createdUser).save()
    const url = `${process.env.CLIENT_URL}/auth/login/${createdUser._id}/verify/${authToken.token}`
    await sendEmail({
      email: createdUser.email,
      subject:
        'You receive an email with a link to verify that you own the email address!',
      text: url
    })

    res.status(201).json({
      data: createdUser,
      successMsg: 'An Email sent to your account. Please verify!'
    })
  } catch (error) {
    next(error)
  }
}

export const loginUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ userName: req.body.userName })
    if (!user) return next(createError(404, 'User not found!'))

    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    )
    if (!isPasswordCorrect) return next(createError(400, 'Wrong credentials'))

    if (!user.isVerified) {
      let token = await AuthToken.findOne({ userId: user._id })
      if (!token) {
        token = await createAuthToken(user).save()
        const url = `${process.env.CLIENT_URL}/auth/login/${user.id}/verify/${token.token}`
        await sendEmail({
          email: user.email,
          subject:
            'You receive an email with a link to verify that you own the email address!',
          text: url
        })
      }
      return next(
        createError(404, 'An Email sent to your account! Please verify!')
      )
    }

    const accessToken = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT
    )
    const sessionToken = jwt.sign(
      {
        _id: user._id,
        userName: user.userName,
        email: user.email,
        hasNewsletter: user.hasNewsletter,
        photo: user.photo,
        isVerified: user.isVerified,
        name: user.name,
        lastName: user.lastName
      },
      process.env.JWT,
      { expiresIn: Number(process.env.SESSION_MAX_AGE) }
    )

    const { password, ...rest } = user._doc
    res
      .cookie('access_token', accessToken, { httpOnly: true })
      .cookie('session_token', sessionToken, { httpOnly: true })
      .status(200)
      .json({ ...rest })
  } catch (error) {
    next(error)
  }
}

export const loginWithJWT = async (req, res, next) => {
  try {
    const { iat, exp, ...user } = jwt.verify(
      req.cookies.session_token,
      process.env.JWT
    )
    res.status(200).json(user)
  } catch (error) {
    next(error)
  }
}

export const verifyAuthToken = async (req, res, next) => {
  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    return next(createError(400, 'Invalid link'))
  }
  try {
    const user = await User.findById(req.params.id)
    if (!user) return next(createError(400, 'Invalid link'))
    const token = await AuthToken.findOne({
      userId: user._id,
      token: req.params.token
    })
    if (!token) return next(createError(400, 'Invalid link'))

    await user.updateOne({ isVerified: true })
    await token.remove()

    res.status(200).json('Email verified successfully!')
  } catch (error) {
    next(error)
  }
}

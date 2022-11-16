import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import { createError } from '../utils/error.js'

export const createUser = async (req, res, next) => {
  const user = req.body
  const salt = bcrypt.genSaltSync(10)
  const hash = bcrypt.hashSync(user.password, salt)

  const isUserNameExist = await User.exists({ userName: user.userName })
  if (isUserNameExist)
    return next(createError(409, `${user.userName} is already exist!`))

  const isEmailExist = await User.exists({ email: user.email })
  if (isEmailExist)
    return next(createError(409, `${user.email} is already exist!`))

  try {
    await new User({ ...user, password: hash }).save()
    res.status(200).json('User has been created')
  } catch (error) {
    next(error)
  }
}

export const updateUser = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    )
    res.status(200).json('User has been updated!')
  } catch (error) {
    next(error)
  }
}

export const deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id)
    res.status(200).json('User has been removed')
  } catch (error) {
    next(error)
  }
}

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
    res.status(200).json(user)
  } catch (error) {
    next(error)
  }
}

export const getAllUsers = async (req, res, next) => {
  const { limit, page = 1, createdAt = 1, ...rest } = req.query

  try {
    const users = await User.find({ ...rest })
      .sort({ createdAt })
      .limit(limit)
      .skip((page - 1) * limit)
    const count = await User.countDocuments({ ...rest })

    res.status(200).json({
      users,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    })
  } catch (error) {
    next(error)
  }
}

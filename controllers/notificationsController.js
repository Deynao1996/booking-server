import Notification from '../models/Notification.js'
import { createError } from '../utils/error.js'

export const createNotification = async (req, res, next) => {
  const newNotification = new Notification(req.body)

  try {
    await newNotification.save()
    res.status(200).json('Notification has been created')
  } catch (error) {
    next(error)
  }
}

export const updateNotification = async (req, res, next) => {
  try {
    if (process.env.APP_STATUS === 'demo') {
      return next(
        createError(
          403,
          'You do not have permission to update notification in demo mode!'
        )
      )
    }
    await Notification.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    )
    res.status(200).json('Notification has been updated!')
  } catch (error) {
    next(error)
  }
}

export const deleteAllNotifications = async (req, res, next) => {
  try {
    if (process.env.APP_STATUS === 'demo') {
      return next(
        createError(
          403,
          'You do not have permission to delete notifications in demo mode!'
        )
      )
    }
    await Notification.deleteMany()
    res.status(200).json('Notifications have been removed')
  } catch (error) {
    next(error)
  }
}

export const getNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id)
    res.status(200).json(notification)
  } catch (error) {
    next(error)
  }
}

export const getAllNotifications = async (req, res, next) => {
  const { limit, page = 1, createdAt = -1, ...rest } = req.query

  try {
    const notifications = await Notification.find({ ...rest })
      .sort({ createdAt })
      .limit(limit)
      .skip((page - 1) * limit)
    const count = await Notification.countDocuments({ ...rest })

    res.status(200).json({
      notifications,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    })
  } catch (error) {
    next(error)
  }
}

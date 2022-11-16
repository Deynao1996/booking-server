import Hotel from '../models/Hotel.js'
import Room from '../models/Room.js'
import Order from '../models/Order.js'
import User from '../models/User.js'
import { startOfDay, endOfDay } from 'date-fns'

export const countAllWidgets = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments()
    const totalHotels = await Hotel.countDocuments()
    const totalOrders = await Order.countDocuments()
    const totalRooms = await Room.countDocuments()
    res.status(200).json({
      users: totalUsers,
      hotels: totalHotels,
      orders: totalOrders,
      rooms: totalRooms
    })
  } catch (error) {
    next(error)
  }
}

export const getPreviousSales = async (req, res, next) => {
  const date = new Date()
  const previousHalfOfYear = new Date(new Date().setMonth(date.getMonth() - 5))
  const queryOptions = {
    ...req.query,
    createdAt: { $gte: previousHalfOfYear }
  }

  try {
    const income = await Order.aggregate([
      {
        $match: queryOptions
      },
      {
        $project: {
          month: { $month: '$createdAt' },
          sales: '$price'
        }
      },
      {
        $group: {
          _id: '$month',
          total: { $sum: '$sales' }
        }
      }
    ])
    res.status(200).json(income)
  } catch (error) {
    next(error)
  }
}

export const getTodaySales = async (req, res, next) => {
  const startDate = startOfDay(new Date())
  const endDate = endOfDay(new Date())

  try {
    const income = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lte: endDate
          }
        }
      },
      {
        $group: {
          _id: 'today',
          total: { $sum: '$price' }
        }
      }
    ])
    res.status(200).json(income)
  } catch (error) {
    next(error)
  }
}

export const getRoomFrequently = async (req, res, next) => {
  const date = new Date()
  const previousHalfOfYear = new Date(new Date().setMonth(date.getMonth() - 5))

  try {
    const room = await Room.findById(req.params.roomId)
    const flatIds = room.roomNumbers.map((room) => room._id.toString())

    const frequently = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: previousHalfOfYear },
          reserveRooms: { $in: flatIds }
        }
      },
      {
        $project: {
          month: { $month: '$createdAt' }
        }
      },
      {
        $group: {
          _id: '$month',
          total: { $sum: 1 }
        }
      }
    ])
    res.status(200).json(frequently)
  } catch (error) {
    next(error)
  }
}

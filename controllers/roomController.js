import Room from '../models/Room.js'
import Hotel from '../models/Hotel.js'
import { createError } from '../utils/error.js'

const dateToString = (date) => new Date(date).toDateString()

export const createRoom = async (req, res, next) => {
  const hotelId = req.params.hotelId
  const title = req.body.title
  const newRoom = new Room(req.body)

  try {
    // const isRoomExist = await Room.exists({
    //   title: { $regex: new RegExp(title, 'i') }
    // })
    // if (isRoomExist) return next(createError(409, `${title} is already exist!`))

    const savedRoom = await newRoom.save()
    await Hotel.findByIdAndUpdate(hotelId, {
      $push: { rooms: savedRoom._id }
    })
    res.status(200).json('Room has been created')
  } catch (error) {
    next(error)
  }
}

export const updateRoom = async (req, res, next) => {
  const { removedRooms, newRooms, hotelId, ...rest } = req.body

  try {
    const newHotel = await Hotel.findById(hotelId)
    if (newHotel) {
      const oldHotel = await Hotel.findOne({ rooms: req.params.id })
      await oldHotel.updateOne({
        $pull: { rooms: req.params.id }
      })
      await newHotel.updateOne({
        $push: { rooms: req.params.id }
      })
    }

    const room = await Room.findById(req.params.id)
    if (newRooms.length) {
      await room.updateOne({
        $push: { roomNumbers: newRooms }
      })
    }
    if (removedRooms.length) {
      const numbers = removedRooms.flatMap((room) => Object.values(room))
      await room.updateOne({
        $pull: { roomNumbers: { number: numbers } }
      })
    }
    await room.updateOne({ $set: rest }, { new: true })
    res.status(200).json('Room has been updated')
  } catch (error) {
    next(error)
  }
}

export const updateRoomAvailability = async (req, res, next) => {
  try {
    const room = await Room.findOne({ 'roomNumbers._id': req.params.id })
    const currentRoom = room.roomNumbers.find(
      (item) => item._id.toString() === req.params.id
    )
    const requestDates = req.body.dates.map(dateToString)
    const isDateExist = currentRoom.unavailableDates.some((unavailableDate) =>
      requestDates.includes(dateToString(unavailableDate))
    )

    if (isDateExist)
      return next(
        createError(
          409,
          'Some of dates already have been ordered. Please check your date range!'
        )
      )

    await Room.updateOne(
      { 'roomNumbers._id': req.params.id },
      {
        $push: { 'roomNumbers.$.unavailableDates': req.body.dates }
      }
    )
    res.status(200).json('Unavailable dates have been changed!')
  } catch (error) {
    next(error)
  }
}

export const clearRoomAvailability = async (req, res, next) => {
  try {
    await Room.updateOne(
      { 'roomNumbers._id': req.params.id },
      {
        $pull: { 'roomNumbers.$.unavailableDates': { $in: req.body.dates } }
      }
    )
    res.status(200).json('Unavailable dates have been cleared!')
  } catch (error) {
    next(error)
  }
}

export const clearRoomDeprecatedDates = async (req, res, next) => {
  try {
    await Room.updateOne(
      { 'roomNumbers._id': req.params.id },
      req.body.operation === 'delete-all'
        ? { $set: { 'roomNumbers.$.unavailableDates': [] } }
        : {
            $pull: {
              'roomNumbers.$.unavailableDates': {
                $lt: new Date(Date.now()).toISOString()
              }
            }
          }
    )
    res.status(200).json('Unavailable dates have been cleared!')
  } catch (error) {
    next(error)
  }
}

export const deleteRoom = async (req, res, next) => {
  try {
    await Room.findByIdAndDelete(req.params.id)
    const hotel = await Hotel.findOne({ rooms: req.params.id })
    await hotel.updateOne({
      $pull: { rooms: req.params.id }
    })
    res.status(200).json('Room has been removed')
  } catch (error) {
    next(error)
  }
}

export const getRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id)
    const hotel = await Hotel.findOne({ rooms: req.params.id }, 'name rooms')
    res.status(200).json({ ...room._doc, hotel: hotel._doc })
  } catch (error) {
    next(error)
  }
}

export const getAllRooms = async (req, res, next) => {
  const { limit, page = 1, createdAt = 1, ...rest } = req.query

  try {
    const rooms = await Room.find({ ...rest })
      .sort({ createdAt })
      .limit(limit)
      .skip((page - 1) * limit)
    const count = await Room.countDocuments({ ...rest })

    const list = await Promise.all(
      rooms.map(async (room) => {
        const roomId = room._id.toString()
        const hotel = await Hotel.findOne({ rooms: roomId }, 'name photos')
        return {
          hotelName: hotel._doc.name,
          hotelImage: hotel._doc.photos[0],
          ...room._doc
        }
      })
    )
    res.status(200).json({
      rooms: list,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    })
  } catch (error) {
    next(error)
  }
}

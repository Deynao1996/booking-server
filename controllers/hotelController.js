import Hotel from '../models/Hotel.js'
import Room from '../models/Room.js'
import { createError } from '../utils/error.js'
import { getMultipleUniqueRandom } from '../utils/getRandomArr.js'

export const createHotel = async (req, res, next) => {
  const newHotel = new Hotel(req.body)

  try {
    if (process.env.APP_STATUS === 'demo') {
      return next(
        createError(
          403,
          'You do not have permission to create hotel in demo mode!'
        )
      )
    }
    await newHotel.save()
    res.status(200).json('Hotel has been created!')
  } catch (error) {
    next(error)
  }
}

export const updateHotel = async (req, res, next) => {
  try {
    if (process.env.APP_STATUS === 'demo') {
      return next(
        createError(
          403,
          'You do not have permission to update hotel in demo mode!'
        )
      )
    }
    await Hotel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    )
    res.status(200).json('Hotel has been updated!')
  } catch (error) {
    next(error)
  }
}

export const deleteHotel = async (req, res, next) => {
  try {
    if (process.env.APP_STATUS === 'demo') {
      return next(
        createError(
          403,
          'You do not have permission to delete hotel in demo mode!'
        )
      )
    }
    const hotel = await Hotel.findById(req.params.id)
    await Promise.all(
      hotel.rooms.map(async (roomId) => {
        await Room.deleteOne({ _id: roomId })
      })
    )
    await hotel.delete()
    res.status(200).json('Hotel has been removed')
  } catch (error) {
    next(error)
  }
}

export const getHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id)
    res.status(200).json(hotel)
  } catch (error) {
    next(error)
  }
}

export const getAllHotels = async (req, res, next) => {
  const { min, max, limit, page = 1, ...rest } = req.query
  const queryOptions = {
    ...rest,
    cheapestPrice: { $gt: (min - 1) | 1, $lt: max || 100000 }
  }
  try {
    const hotels = await Hotel.find(queryOptions)
      .limit(limit)
      .skip((page - 1) * limit)

    const count = await Hotel.countDocuments(queryOptions)

    res.status(200).json({
      hotels,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    })
  } catch (error) {
    next(error)
  }
}

export const getRandomCities = async (req, res, next) => {
  try {
    const cities = await Hotel.find({}, 'city cityImg _id')
    const randomCityList = getMultipleUniqueRandom(
      cities,
      req.params.limit || 3
    )
    const list = await Promise.all(
      randomCityList.map((city) => {
        return Hotel.countDocuments({ city: city.city })
      })
    )
    const result = randomCityList.map((city, i) => ({
      city: city.city,
      cityImg: city.cityImg,
      _id: city._id,
      count: list[i]
    }))
    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}

export const getAllCities = async (req, res, next) => {
  try {
    const cities = await Hotel.find({}, 'city')
    const citiesList = cities.map((item) => item.city)
    const unique = [...new Set(citiesList)]
    res.status(200).json(unique)
  } catch (error) {
    next(error)
  }
}

export const countByCity = async (req, res, next) => {
  const cities = req.query.cities.split(',')

  try {
    const list = await Promise.all(
      cities.map((city) => {
        return Hotel.countDocuments({ city: city })
      })
    )
    res.status(200).json(list)
  } catch (error) {
    next(error)
  }
}

export const getProperties = async (req, res, next) => {
  try {
    const hotelCount = await Hotel.countDocuments({ type: 'hotel' })
    const apartmentCount = await Hotel.countDocuments({ type: 'apartments' })
    const resortCount = await Hotel.countDocuments({ type: 'resorts' })
    const villaCount = await Hotel.countDocuments({ type: 'villas' })
    const cabinCount = await Hotel.countDocuments({ type: 'cabins' })

    res.status(200).json([
      {
        type: 'hotel',
        count: hotelCount,
        img: 'https://res.cloudinary.com/dkl9cqqui/image/upload/v1692333283/hotel-min_dqxkzx.jpg'
      },
      {
        type: 'apartments',
        count: apartmentCount,
        img: 'https://res.cloudinary.com/dkl9cqqui/image/upload/v1692333283/apart-min_d6q6vx.jpg'
      },
      {
        type: 'resorts',
        count: resortCount,
        img: 'https://res.cloudinary.com/dkl9cqqui/image/upload/v1692333283/resort-min_nwv4gm.jpg'
      },
      {
        type: 'villas',
        count: villaCount,
        img: 'https://res.cloudinary.com/dkl9cqqui/image/upload/v1692333283/villa-min_rbq3xt.jpg'
      },
      {
        type: 'cabins',
        count: cabinCount,
        img: 'https://res.cloudinary.com/dkl9cqqui/image/upload/v1692333283/cabin-min_rj4isx.jpg'
      }
    ])
  } catch (error) {
    next(error)
  }
}

export const getHotelRooms = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id)
    const list = await Promise.all(
      hotel.rooms.map((room) => {
        return Room.findById(room)
      })
    )
    res.status(200).json(list)
  } catch (error) {
    next(error)
  }
}

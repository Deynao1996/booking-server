import Hotel from '../models/Hotel.js'
import Room from '../models/Room.js'
import { getMultipleUniqueRandom } from '../utils/getRandomArr.js'

export const createHotel = async (req, res, next) => {
  const newHotel = new Hotel(req.body)

  try {
    await newHotel.save()
    res.status(200).json('Hotel has been created!')
  } catch (error) {
    next(error)
  }
}

export const updateHotel = async (req, res, next) => {
  try {
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
        img: 'https://cf.bstatic.com/xdata/images/xphoto/square300/57584488.webp?k=bf724e4e9b9b75480bbe7fc675460a089ba6414fe4693b83ea3fdd8e938832a6&o='
      },
      {
        type: 'apartments',
        count: apartmentCount,
        img: 'https://cf.bstatic.com/static/img/theme-index/carousel_320x240/card-image-apartments_300/9f60235dc09a3ac3f0a93adbc901c61ecd1ce72e.jpg'
      },
      {
        type: 'resorts',
        count: resortCount,
        img: 'https://cf.bstatic.com/static/img/theme-index/carousel_320x240/bg_resorts/6f87c6143fbd51a0bb5d15ca3b9cf84211ab0884.jpg  '
      },
      {
        type: 'villas',
        count: villaCount,
        img: 'https://cf.bstatic.com/static/img/theme-index/carousel_320x240/card-image-villas_300/dd0d7f8202676306a661aa4f0cf1ffab31286211.jpg'
      },
      {
        type: 'cabins',
        count: cabinCount,
        img: 'https://cf.bstatic.com/static/img/theme-index/carousel_320x240/card-image-chalet_300/8ee014fcc493cb3334e25893a1dee8c6d36ed0ba.jpg'
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

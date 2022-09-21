import express from 'express'
import {
  createHotel,
  deleteHotel,
  getAllHotels,
  getHotel,
  updateHotel,
  getHotelRooms,
  getRandomCities,
  getProperties,
  getAllCities
} from '../controllers/hotelController.js'
import { verifyAdmin } from '../utils/verifyToken.js'

const router = express.Router()

//CREATE
router.post('/', createHotel)

//UPDATE
router.put('/:id', verifyAdmin, updateHotel)

//DELETE
router.delete('/:id', verifyAdmin, deleteHotel)

//GET
router.get('/find/:id', getHotel)

//GET ALL
router.get('/', getAllHotels)

//GET ALL PROPERTIES
router.get('/properties', getProperties)

//GET ROOMS
router.get('/room/:id', getHotelRooms)

//GET ALL CITIES
router.get('/cities', getAllCities)

//GET RANDOM CITIES
router.get('/random-cities', getRandomCities)

export default router

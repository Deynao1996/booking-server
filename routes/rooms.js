import express from 'express'
import {
  createRoom,
  deleteRoom,
  getAllRooms,
  getRoom,
  updateRoom,
  updateRoomAvailability,
  clearRoomAvailability,
  clearRoomDeprecatedDates
} from '../controllers/roomController.js'
import { verifyAdmin } from '../utils/verifyToken.js'

const router = express.Router()

//CREATE
router.post('/:hotelId', createRoom)

//UPDATE
router.put('/change/:id', verifyAdmin, updateRoom)

//UPDATE
router.put('/clear/:id', verifyAdmin, clearRoomAvailability)

//UPDATE AVAILABILITY
router.put('/availability/:id', updateRoomAvailability)

//REMOVE DEPRECATED DATES
router.put('/remove/:id', clearRoomDeprecatedDates)

//DELETE
router.delete('/:id', verifyAdmin, deleteRoom)

//GET
router.get('/:id', getRoom)

//GET ALL
router.get('/', getAllRooms)

export default router

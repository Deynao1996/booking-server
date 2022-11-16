import express from 'express'
import {
  countAllWidgets,
  getPreviousSales,
  getTodaySales,
  getRoomFrequently
} from '../controllers/statsController.js'
import { verifyAdmin } from '../utils/verifyToken.js'

const router = express.Router()

//COUNT ALL WIDGETS
router.get('/widgets', verifyAdmin, countAllWidgets)

//GET SALES FOR MONTHS
router.get('/sales/months', verifyAdmin, getPreviousSales)

//GET SALES FOR TODAY
router.get('/sales/today', verifyAdmin, getTodaySales)

//GET ROOM BOOKING FREQUENTLY
router.get('/frequently/room/:roomId', verifyAdmin, getRoomFrequently)

export default router

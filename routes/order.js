import express from 'express'
import {
  createOrder,
  updateOrder,
  deleteOrder,
  getOrder,
  getAllOrders
} from '../controllers/orderController.js'
import { verifyAdmin } from '../utils/verifyToken.js'

const router = express.Router()

//CREATE
router.post('/', createOrder)

//UPDATE
router.put('/:id', updateOrder)

//DELETE
router.delete('/:id', verifyAdmin, deleteOrder)

//GET
router.get('/find/:id', getOrder)

//GET ALL
router.get('/', getAllOrders)

export default router

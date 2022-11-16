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
router.put('/:id', verifyAdmin, updateOrder)

//DELETE
router.delete('/:id', verifyAdmin, deleteOrder)

//GET
router.get('/find/:id', getOrder)

//GET ALL
router.get('/', verifyAdmin, getAllOrders)

export default router

import express from 'express'
import {
  createNotification,
  deleteAllNotifications,
  getAllNotifications,
  getNotification,
  updateNotification
} from '../controllers/notificationsController.js'
import { verifyAdmin } from '../utils/verifyToken.js'

const router = express.Router()

//CREATE
router.post('/', createNotification)

//UPDATE
router.put('/:id', verifyAdmin, updateNotification)

//DELETE
router.delete('/', verifyAdmin, deleteAllNotifications)

//GET
router.get('/:id', getNotification)

//GET ALL
router.get('/', getAllNotifications)

export default router

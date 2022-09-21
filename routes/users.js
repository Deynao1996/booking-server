import express from 'express'
import {
  deleteUser,
  getAllUsers,
  getUser,
  updateUser
} from '../controllers/userController.js'
import { verifyUser, verifyAdmin } from '../utils/verifyToken.js'

const router = express.Router()

//UPDATE
router.put('/:id', updateUser)

//DELETE
router.delete('/:id', verifyUser, deleteUser)

//GET
router.get('/:id', verifyUser, getUser)

//GET ALL
router.get('/', verifyAdmin, getAllUsers)

export default router

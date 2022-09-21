import express from 'express'
import {
  sendPasswordLink,
  verifyLink,
  setNewPassword
} from '../controllers/resetPasswordController.js'

const router = express.Router()

//SEND PASSWORD LINK
router.post('/', sendPasswordLink)

//VERIFY LINK
router.get('/:id/:token', verifyLink)

//SET NEW PASSWORD
router.post('/:id/:token', setNewPassword)

export default router

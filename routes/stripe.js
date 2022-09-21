import express from 'express'
import { createWebhook, sendPayment } from '../controllers/stripeController.js'

const router = express.Router()

router.post('/create-checkout-session', sendPayment)

router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  createWebhook
)

export default router

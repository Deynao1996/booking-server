import Order from '../models/Order.js'
import * as dotenv from 'dotenv'
import Stripe from 'stripe'
import { sendEmail } from '../utils/sendEmail.js'

dotenv.config()
const stripe = new Stripe(process.env.STRIPE)

const emailConfig = {
  subject: 'Thanks for the payment for the product!',
  text: 'Thanks for the payment for the product!',
  html: `
  Hello! I just wanted to drop you a quick note to let you know that we have received your recent payment. Thank you very much. We really appreciate it.
  <br />
  <br />
  If you would like to re-order please call 1234 5678 1234 or email deynao1996@gmail.com
  <br />
  <br />
  Thanks
  `
}

export const sendPayment = async (req, res) => {
  const { userId, image, _id, email, ...order } = req.body.order
  const line_items = [
    {
      price_data: {
        currency: 'usd',
        product_data: {
          name: order.hotelName,
          images: [image],
          description: order.descr
        },
        unit_amount: order.price * 100
      },
      quantity: 1
    }
  ]

  const customer = await stripe.customers.create({
    metadata: {
      order: JSON.stringify({ _id, email })
    }
  })

  const session = await stripe.checkout.sessions.create({
    customer: customer.id,
    line_items,
    mode: 'payment',
    success_url: `${process.env.CLIENT_URL}?success=true`,
    cancel_url: `${process.env.CLIENT_URL}?success=false`
  })

  res.send({ url: session.url })
}

export const createWebhook = async (req, res) => {
  let event = req.body
  if (process.env.ENDPOINT) {
    const signature = req.headers['stripe-signature']
    try {
      event = stripe.webhooks.constructEvent(
        req.rawBody,
        signature,
        process.env.ENDPOINT
      )
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`, err.message)
    }
  }

  const data = event.data.object
  if (event.type === 'payment_intent.succeeded') {
    try {
      const customer = await stripe.customers.retrieve(data.customer)
      await finishPayment(customer)
      await sendEmail({ email: customer.email, ...emailConfig })
    } catch (error) {
      console.log(error)
    }
  }

  res.send().end()
}

async function finishPayment(customer) {
  const { _id } = JSON.parse(customer.metadata.order)
  try {
    await Order.findByIdAndUpdate(_id, { isPaid: true })
  } catch (error) {
    console.log(error.message)
  }
}

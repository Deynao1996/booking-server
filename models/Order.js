import mongoose from 'mongoose'

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    reserveRooms: { type: [String], required: true },
    hotelName: { type: String, required: true },
    descr: { type: String, required: true },
    price: { type: Number, required: true },
    isPaid: { type: Boolean, default: false },
    deliver_status: { type: String, default: 'pending' },
    dates: { type: [Date], required: true }
  },
  { timestamps: true }
)

export default mongoose.model('Order', OrderSchema)

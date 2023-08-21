import mongoose from 'mongoose'

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    hotelId: { type: String, required: true },
    userName: { type: String, required: true, default: 'Not provide' },
    hotelImage: { type: String },
    reserveRooms: { type: [String], required: true },
    hotelName: { type: String, required: true },
    descr: { type: String, required: true },
    price: { type: Number, required: true },
    isPaid: { type: Boolean, default: false },
    status: { type: String, default: 'pending' },
    dates: { type: [Date], required: true },
    isTest: { type: Boolean, default: true }
  },
  { timestamps: true }
)

export default mongoose.model('Order', OrderSchema)

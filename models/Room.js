import mongoose from 'mongoose'

const RoomSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    maxPeople: { type: Number, required: true },
    descr: { type: String, default: false },
    roomNumbers: [{ number: Number, unavailableDates: { type: [Date] } }],
    isTest: { type: Boolean, default: true }
  },
  { timestamps: true }
)

export default mongoose.model('Room', RoomSchema)

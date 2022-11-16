import mongoose from 'mongoose'

const NotificationSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    type: {
      type: String,
      enum: ['new-order', 'new-user'],
      required: true
    },
    metaId: { type: String }
  },
  { timestamps: true }
)

export default mongoose.model('Notification', NotificationSchema)

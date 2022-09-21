import mongoose from 'mongoose'
import findOrCreate from 'findorcreate-promise'

const UserSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      required: true
    },
    password: { type: String, required: true },
    hasNewsletter: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    photo: { type: String },
    passportId: { type: String }
  },
  { timestamps: true }
)

UserSchema.plugin(findOrCreate)

export default mongoose.model('User', UserSchema)

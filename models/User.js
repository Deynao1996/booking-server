import mongoose from 'mongoose'
import findOrCreate from 'findorcreate-promise'

const UserSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true, unique: true },
    name: { type: String, required: true, default: 'Not provide' },
    lastName: { type: String, required: true, default: 'Not provide' },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      required: true,
      unique: true
    },
    password: { type: String, required: true },
    hasNewsletter: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    photo: { type: String },
    passportId: { type: String },
    isTest: { type: Boolean, default: true }
  },
  { timestamps: true }
)

UserSchema.plugin(findOrCreate)

export default mongoose.model('User', UserSchema)

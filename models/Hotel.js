import mongoose from 'mongoose'

const HotelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  city: { type: String, required: true },
  cityImg: {
    type: String,
    default: 'https://mizez.com/custom/mizez/img/general/no-image-available.png'
  },
  address: { type: String, required: true },
  distance: { type: String, required: true },
  description: { type: String, required: true },
  subDescription: { type: String, required: true },
  rating: { type: Number, min: 0, max: 10, default: 0 },
  rooms: { type: [String] },
  photos: { type: [String] },
  title: { type: String, required: true },
  cheapestPrice: { type: Number, require: true },
  features: { type: String },
  featured: { type: Boolean, default: false }
})

export default mongoose.model('Hotel', HotelSchema)

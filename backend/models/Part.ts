import mongoose, { Document, Schema } from 'mongoose'

export interface IPart extends Document {
  name: string
  description: string
  price: number
  cost: number
  inStock: number
  supplier: mongoose.Types.ObjectId
  createdAt: Date
}

const PartSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  partNumber: { type: String, required: true },
  price: { type: Number, required: true },
  cost: { type: Number, require: true },
  inStock: { type: Number, default: 0 },
  supplier: { type: Schema.Types.ObjectId, ref: 'Supplier', required: true },
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.model<IPart>('Part', PartSchema)
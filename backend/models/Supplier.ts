import mongoose, { Document, Schema } from 'mongoose'

export interface ISupplier extends Document {
  name: string
  contactPerson: string
  email: string
  phone: string
  address: string
  createdAt: Date
}

const SupplierSchema = new Schema({
  name: { type: String, required: true },
  contactPerson: { type: String },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.model<ISupplier>('Supplier', SupplierSchema)
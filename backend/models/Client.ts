import mongoose, { Document, Schema } from "mongoose";

export interface IClient extends Document {
  name: string
  email: string
  phone: string
  address: string
  createdAt: Date
}

const ClientSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.model<IClient>('Client', ClientSchema)
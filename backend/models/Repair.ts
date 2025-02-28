import mongoose, { Document, Schema } from "mongoose";

export interface IRepair extends Document {
  description: string
  estimatedHours: number
  hourlyRate: number
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled'
  createdAt: Date
}

const RepairSchema = new Schema({
  description: { type: String, required: true },
  estimatedHours: { type: Number, required: true },
  hourlyRate: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.model<IRepair>('Repair', RepairSchema)
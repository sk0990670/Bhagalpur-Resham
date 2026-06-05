import mongoose, { Document, Schema } from 'mongoose';

export interface ICounter extends Document {
  id: string;      // The identifier for the sequence (e.g., 'orderNumber', 'invoiceNumber')
  seq: number;     // The current sequence value
}

const counterSchema = new Schema<ICounter>({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  seq: {
    type: Number,
    default: 0,
  },
});

export const Counter = mongoose.model<ICounter>('Counter', counterSchema);

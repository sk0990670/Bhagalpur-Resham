import mongoose, { Document, Schema } from 'mongoose';

export interface IArtisan extends Document {
  artisanId: string;
  name: string;
  phone: string;
  email: string;
  photo?: string;
  address: string;
  city: string;
  state: string;
  specialization: string[];
  experienceYears: number;
  dailyCapacity: number;
  status: 'available' | 'busy' | 'on_leave';
  joiningDate: Date;
  activeOrders: number;
  completedOrders: number;
  averageCompletionTime?: number; // in days
  qualityRating: number;
  earnings: number;
  bankDetails?: {
    accountName: string;
    accountNumber: string;
    ifscCode: string;
    bankName: string;
  };
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const artisanSchema = new Schema<IArtisan>(
  {
    artisanId: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true }, // made optional but unique if provided
    photo: { type: String },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    specialization: { type: [String], required: true },
    experienceYears: { type: Number, required: true, min: 0 },
    dailyCapacity: { type: Number, required: true, default: 5 },
    status: {
      type: String,
      enum: ['available', 'busy', 'on_leave'],
      default: 'available',
    },
    joiningDate: { type: Date, default: Date.now },
    activeOrders: { type: Number, default: 0 },
    completedOrders: { type: Number, default: 0 },
    averageCompletionTime: { type: Number, default: 0 },
    qualityRating: { type: Number, default: 5.0, min: 0, max: 5 },
    earnings: { type: Number, default: 0 },
    bankDetails: {
      accountName: { type: String },
      accountNumber: { type: String },
      ifscCode: { type: String },
      bankName: { type: String },
    },
    notes: { type: String },
  },
  {
    timestamps: true,
  }
);

export const artisanRepository = mongoose.model<IArtisan>('Artisan', artisanSchema);

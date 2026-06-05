import mongoose, { Document, Schema } from 'mongoose';

export interface IAssignment extends Document {
  orderId: mongoose.Types.ObjectId;
  artisanId: mongoose.Types.ObjectId;
  assignedDate: Date;
  assignedBy: mongoose.Types.ObjectId;
  status: 'pending' | 'in_progress' | 'completed' | 'delayed';
  expectedCompletionDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const assignmentSchema = new Schema<IAssignment>(
  {
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    artisanId: { type: Schema.Types.ObjectId, ref: 'Artisan', required: true },
    assignedDate: { type: Date, default: Date.now },
    assignedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed', 'delayed'],
      default: 'pending',
    },
    expectedCompletionDate: { type: Date },
  },
  {
    timestamps: true,
  }
);

export const assignmentRepository = mongoose.model<IAssignment>('ProductionAssignment', assignmentSchema);

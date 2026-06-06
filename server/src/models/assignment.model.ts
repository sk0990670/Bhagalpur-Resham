import mongoose, { Document, Schema } from 'mongoose';

export interface IAssignment extends Document {
  assignmentId: string;
  orderId: mongoose.Types.ObjectId;
  artisanId: mongoose.Types.ObjectId;
  assignedDate: Date;
  assignedBy: mongoose.Types.ObjectId;
  status: 'pending' | 'in_progress' | 'completed' | 'delayed';
  currentStage: 'assigned' | 'yarn_preparation' | 'dyeing' | 'weaving' | 'finishing' | 'quality_check' | 'ready_for_dispatch' | 'completed';
  expectedCompletionDate?: Date;
  artisanCharge: number;
  amountPaid: number;
  remainingAmount: number;
  paymentCompleted: boolean;
  paymentCompletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const assignmentSchema = new Schema<IAssignment>(
  {
    assignmentId: { type: String, required: true, unique: true },
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    artisanId: { type: Schema.Types.ObjectId, ref: 'Artisan', required: true },
    assignedDate: { type: Date, default: Date.now },
    assignedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed', 'delayed'],
      default: 'pending',
    },
    currentStage: {
      type: String,
      enum: ['assigned', 'yarn_preparation', 'dyeing', 'weaving', 'finishing', 'quality_check', 'ready_for_dispatch', 'completed'],
      default: 'assigned',
    },
    expectedCompletionDate: { type: Date },
    artisanCharge: { type: Number, default: 0 },
    amountPaid: { type: Number, default: 0 },
    remainingAmount: { type: Number, default: 0 },
    paymentCompleted: { type: Boolean, default: false },
    paymentCompletedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

export const assignmentRepository = mongoose.model<IAssignment>('ProductionAssignment', assignmentSchema);

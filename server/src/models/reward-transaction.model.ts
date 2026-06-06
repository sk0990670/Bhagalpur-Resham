import mongoose, { Document, Schema } from 'mongoose';

export interface IRewardTransaction extends Document {
  userId: mongoose.Types.ObjectId;
  orderId?: mongoose.Types.ObjectId;
  points: number;
  type: 'earned' | 'redeemed' | 'adjusted' | 'expired';
  reason: string;
  creditedAt: Date;
  createdAt: Date;
}

const rewardTransactionSchema = new Schema<IRewardTransaction>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
    points: { type: Number, required: true },
    type: { 
      type: String, 
      enum: ['earned', 'redeemed', 'adjusted', 'expired'], 
      required: true,
      default: 'earned'
    },
    reason: { type: String, required: true },
    creditedAt: { type: Date, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

rewardTransactionSchema.index({ userId: 1 });
rewardTransactionSchema.index({ orderId: 1 });

export const RewardTransaction = mongoose.model<IRewardTransaction>('RewardTransaction', rewardTransactionSchema);

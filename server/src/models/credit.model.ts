import mongoose, { Document, Schema } from 'mongoose';

export interface IArtisanCreditWallet extends Document {
  customerId: mongoose.Types.ObjectId;
  availableCredits: number;
  earnedCredits: number;
  redeemedCredits: number;
  updatedAt: Date;
}

export interface IArtisanCreditTransaction extends Document {
  transactionId: string;
  customerId: mongoose.Types.ObjectId;
  orderId?: mongoose.Types.ObjectId;
  type: 'CREDIT_EARNED' | 'CREDIT_REDEEMED' | 'CREDIT_EXPIRED' | 'CREDIT_ADJUSTMENT' | 'CREDIT_REVERSAL';
  credits: number;
  amount: number; // Value in INR equivalent
  createdAt: Date;
}

const artisanCreditWalletSchema = new Schema<IArtisanCreditWallet>(
  {
    customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    availableCredits: { type: Number, default: 0 },
    earnedCredits: { type: Number, default: 0 },
    redeemedCredits: { type: Number, default: 0 },
  },
  { timestamps: { updatedAt: true, createdAt: false } }
);

const artisanCreditTransactionSchema = new Schema<IArtisanCreditTransaction>(
  {
    transactionId: { type: String, required: true, unique: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
    type: { 
      type: String, 
      enum: ['CREDIT_EARNED', 'CREDIT_REDEEMED', 'CREDIT_EXPIRED', 'CREDIT_ADJUSTMENT', 'CREDIT_REVERSAL'], 
      required: true 
    },
    credits: { type: Number, required: true },
    amount: { type: Number, required: true }, // Equivalent INR value
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const ArtisanCreditWallet = mongoose.model<IArtisanCreditWallet>('ArtisanCreditWallet', artisanCreditWalletSchema);
export const ArtisanCreditTransaction = mongoose.model<IArtisanCreditTransaction>('ArtisanCreditTransaction', artisanCreditTransactionSchema);

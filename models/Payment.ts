import mongoose from 'mongoose';

export interface IPayment extends mongoose.Document {
  buyerId: mongoose.Types.ObjectId;
  buyerName: string;
  buyerEmail: string;
  amount: number;
  coins: number;
  paymentMethod: string;
  transactionId: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentDate: Date;
  processedDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new mongoose.Schema<IPayment>({
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  buyerName: {
    type: String,
    required: true,
  },
  buyerEmail: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  coins: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
    default: 'Stripe',
  },
  transactionId: {
    type: String,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'completed',
  },
  paymentDate: {
    type: Date,
    default: Date.now,
  },
  processedDate: {
    type: Date,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema);
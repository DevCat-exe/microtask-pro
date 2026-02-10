import mongoose from 'mongoose';

export interface IWithdrawal extends mongoose.Document {
  workerId: mongoose.Types.ObjectId;
  workerName: string;
  workerEmail: string;
  withdrawalCoin: number;
  withdrawalAmount: number;
  paymentSystem: string;
  accountNumber: string;
  withdrawDate: Date;
  status: 'pending' | 'approved' | 'rejected';
  processedDate?: Date;
  transactionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const WithdrawalSchema = new mongoose.Schema<IWithdrawal>({
  workerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  workerName: {
    type: String,
    required: true,
  },
  workerEmail: {
    type: String,
    required: true,
  },
  withdrawalCoin: {
    type: Number,
    required: true,
    min: [200, 'Minimum withdrawal is 200 coins'],
  },
  withdrawalAmount: {
    type: Number,
    required: true,
  },
  paymentSystem: {
    type: String,
    required: true,
  },
  accountNumber: {
    type: String,
    required: true,
  },
  withdrawDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  processedDate: {
    type: Date,
  },
  transactionId: {
    type: String,
  },
}, {
  timestamps: true,
});

// Pre-save middleware to calculate withdrawal amount
WithdrawalSchema.pre('save', async function(this: IWithdrawal) {
  if (this.isNew) {
    this.withdrawalAmount = this.withdrawalCoin / 20; // 20 coins = $1
  }
});

export default mongoose.models.Withdrawal || mongoose.model<IWithdrawal>('Withdrawal', WithdrawalSchema);
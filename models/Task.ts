import mongoose from 'mongoose';

export interface ITask extends mongoose.Document {
  title: string;
  detail: string;
  requiredWorkers: number;
  payableAmount: number;
  completionDate: Date;
  submissionInfo: string;
  taskImageUrl?: string;
  buyerId: mongoose.Types.ObjectId;
  buyerName: string;
  buyerEmail: string;
  status: 'active' | 'completed' | 'cancelled';
  remainingWorkers: number;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new mongoose.Schema<ITask>({
  title: {
    type: String,
    required: [true, 'Please provide a task title'],
    trim: true,
  },
  detail: {
    type: String,
    required: [true, 'Please provide task details'],
  },
  requiredWorkers: {
    type: Number,
    required: [true, 'Please specify required workers'],
    min: [1, 'Must require at least 1 worker'],
  },
  payableAmount: {
    type: Number,
    required: [true, 'Please specify payable amount'],
    min: [1, 'Amount must be at least 1 coin'],
  },
  completionDate: {
    type: Date,
    required: [true, 'Please provide completion date'],
  },
  submissionInfo: {
    type: String,
    required: [true, 'Please provide submission requirements'],
  },
  taskImageUrl: {
    type: String,
    default: '',
  },
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
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active',
  },
  remainingWorkers: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true,
});

// Pre-save middleware to set remainingWorkers
TaskSchema.pre('save', async function(this: ITask) {
  if (this.isNew) {
    this.remainingWorkers = this.requiredWorkers;
  }
});

export default mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema);
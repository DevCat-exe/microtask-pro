import mongoose from 'mongoose';

export interface ISubmission extends mongoose.Document {
  taskId: mongoose.Types.ObjectId;
  taskTitle: string;
  payableAmount: number;
  workerId: mongoose.Types.ObjectId;
  workerName: string;
  workerEmail: string;
  buyerId: mongoose.Types.ObjectId;
  buyerName: string;
  buyerEmail: string;
  submissionDetails: string;
  status: 'pending' | 'approved' | 'rejected';
  submissionDate: Date;
  reviewedDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SubmissionSchema = new mongoose.Schema<ISubmission>({
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true,
  },
  taskTitle: {
    type: String,
    required: true,
  },
  payableAmount: {
    type: Number,
    required: true,
  },
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
  submissionDetails: {
    type: String,
    required: [true, 'Please provide submission details'],
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  submissionDate: {
    type: Date,
    default: Date.now,
  },
  reviewedDate: {
    type: Date,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Submission || mongoose.model<ISubmission>('Submission', SubmissionSchema);
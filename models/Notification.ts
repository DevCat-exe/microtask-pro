import mongoose from 'mongoose';

export interface INotification extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  actionUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new mongoose.Schema<INotification>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  message: {
    type: String,
    required: [true, 'Please provide a notification message'],
  },
  type: {
    type: String,
    enum: ['info', 'success', 'warning', 'error'],
    default: 'info',
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  actionUrl: {
    type: String,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);

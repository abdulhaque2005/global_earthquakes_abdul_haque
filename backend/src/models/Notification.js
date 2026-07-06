import mongoose from 'mongoose';
const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Notification title is required'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Notification message is required'],
      trim: true,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    type: {
      type: String,
      enum: ['Alert', 'System', 'Report'],
      default: 'Alert',
    },
  },
  {
    timestamps: true,
  }
);
const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;

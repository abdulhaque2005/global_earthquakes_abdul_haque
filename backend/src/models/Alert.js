import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Alert title is required'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Alert message is required'],
      trim: true,
    },
    magnitude: {
      type: Number,
      index: true,
    },
    place: {
      type: String,
      trim: true,
      index: true,
    },
    riskLevel: {
      type: String,
      enum: ['Low', 'Moderate', 'High', 'Critical'],
      default: 'Moderate',
      index: true,
    },
    type: {
      type: String,
      enum: ['Emergency', 'Warning', 'Info'],
      default: 'Info',
      index: true,
    },
    status: {
      type: String,
      enum: ['Active', 'Resolved'],
      default: 'Active',
      index: true,
    },
    earthquakeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Earthquake',
    },
  },
  {
    timestamps: true,
  }
);

const Alert = mongoose.model('Alert', alertSchema);

export default Alert;

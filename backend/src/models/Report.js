import mongoose from 'mongoose';
const reportSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Report title is required'],
      trim: true,
    },
    summary: {
      type: String,
      required: [true, 'Report summary is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['Analytics', 'System', 'User-Felt'],
      default: 'Analytics',
    },
    earthquakeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Earthquake',
    },
    generatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    metrics: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);
const Report = mongoose.model('Report', reportSchema);
export default Report;

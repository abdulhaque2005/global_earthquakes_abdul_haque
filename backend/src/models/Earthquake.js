import mongoose from 'mongoose';

const earthquakeSchema = new mongoose.Schema(
  {
    time: {
      type: Date,
      required: [true, 'Time of the earthquake is required'],
      index: true,
    },
    latitude: {
      type: Number,
      required: [true, 'Latitude is required'],
      min: -90,
      max: 90,
    },
    longitude: {
      type: Number,
      required: [true, 'Longitude is required'],
      min: -180,
      max: 180,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    depth: {
      type: Number,
      required: [true, 'Depth is required'],
      index: true,
    },
    magnitude: {
      type: Number,
      required: [true, 'Magnitude is required'],
      index: true,
    },
    magType: {
      type: String,
      trim: true,
      index: true,
    },
    nst: {
      type: Number,
      default: null,
    },
    gap: {
      type: Number,
      default: null,
      index: true,
    },
    dmin: {
      type: Number,
      default: null,
    },
    rms: {
      type: Number,
      default: null,
      index: true,
    },
    net: {
      type: String,
      trim: true,
      index: true,
    },
    place: {
      type: String,
      required: [true, 'Place description is required'],
      trim: true,
      index: true,
    },
    type: {
      type: String,
      default: 'earthquake',
      trim: true,
      index: true,
    },
    horizontalError: {
      type: Number,
    },
    depthError: {
      type: Number,
    },
    magError: {
      type: Number,
    },
    magNst: {
      type: Number,
      default: null,
    },
    status: {
      type: String,
      trim: true,
      index: true,
    },
    locationSource: {
      type: String,
      trim: true,
    },
    magSource: {
      type: String,
      trim: true,
    },
    updated: {
      type: Date,
    },
    riskLevel: {
      type: String,
      enum: ['Low', 'Moderate', 'High', 'Critical'],
      default: 'Low',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

earthquakeSchema.index({ location: '2dsphere' });
earthquakeSchema.index({ magnitude: -1, time: -1 });
earthquakeSchema.index({ depth: -1 });
earthquakeSchema.index({ net: 1, status: 1 });
earthquakeSchema.index({ place: 'text' });

earthquakeSchema.pre('save', function (next) {
  if (this.longitude !== undefined && this.latitude !== undefined) {
    this.location = {
      type: 'Point',
      coordinates: [this.longitude, this.latitude],
    };
  }
  next();
});

const Earthquake = mongoose.model('Earthquake', earthquakeSchema);

export default Earthquake;

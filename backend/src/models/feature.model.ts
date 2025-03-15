import { Schema, model, Document } from 'mongoose';

export interface FeatureDocument extends Document {
  name: string;
  description: string;
  type: string;
  status: 'active' | 'inactive';
  config?: Record<string, any>;
}

const featureSchema = new Schema<FeatureDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    config: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
featureSchema.index({ type: 1, status: 1 });

export const FeatureModel = model<FeatureDocument>('Feature', featureSchema); 
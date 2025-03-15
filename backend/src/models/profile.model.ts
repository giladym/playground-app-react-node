import { Schema, model, Document, Types } from 'mongoose';

export interface ProfileDocument extends Document {
  userId: Types.ObjectId;
  name: string;
  age?: number;
  phone?: string;
  imageUrl?: string;
  organizationId?: Types.ObjectId;
}

const profileSchema = new Schema<ProfileDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      min: 0,
      max: 150,
    },
    phone: {
      type: String,
      trim: true,
      validate: {
        validator: function(v: string) {
          return /^\+?[\d\s-]+$/.test(v);
        },
        message: props => `${props.value} is not a valid phone number!`
      },
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
profileSchema.index({ userId: 1 });
profileSchema.index({ organizationId: 1 });

export const ProfileModel = model<ProfileDocument>('Profile', profileSchema); 
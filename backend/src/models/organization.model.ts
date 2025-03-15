import { Schema, model, Document, HydratedDocument } from 'mongoose';
import { ProfileModel } from './profile.model';

export interface OrganizationDocument extends Document {
  name: string;
  description: string;
  imageUrl?: string;
  status: 'active' | 'inactive';
}

const organizationSchema = new Schema<OrganizationDocument>(
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
    imageUrl: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

// Prevent deletion if organization has active users
organizationSchema.pre('deleteOne', { document: true, query: false }, async function(this: HydratedDocument<OrganizationDocument>, next: (err?: Error) => void) {
  const activeUsers = await ProfileModel.countDocuments({ organizationId: this._id });
  
  if (activeUsers > 0) {
    next(new Error('Cannot delete organization with active users'));
  } else {
    next();
  }
});

export const OrganizationModel = model<OrganizationDocument>('Organization', organizationSchema); 
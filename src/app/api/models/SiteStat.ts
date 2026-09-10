import mongoose, { Schema, Document } from 'mongoose';

// Define TypeScript interface for SiteStat
export interface ISiteStat extends Document {
  label: string;
  value: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

// Define the schema
const siteStatSchema = new Schema<ISiteStat>({
  label: {
    type: String,
    required: true,
    trim: true
  },
  value: {
    type: String,
    required: true,
    trim: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for frontend compatibility - convert _id to id
siteStatSchema.virtual('id').get(function(this: ISiteStat) {
  return this._id.toHexString();
});

// Ensure virtual fields are serialized
siteStatSchema.set('toJSON', {
  virtuals: true,
  transform: (doc: ISiteStat, ret: any) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

export const SiteStat =
  (mongoose.models && mongoose.models['SiteStat']) ||
  mongoose.model<ISiteStat>('SiteStat', siteStatSchema);
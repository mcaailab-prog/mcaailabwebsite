import mongoose, { Schema, Document } from 'mongoose';

// Define TypeScript interface for Partner
export interface IPartner extends Document {
  name: string;
  logo: string;
  website: string;
  description: string;
  partner_type: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

// Define enum for partner types
const partnerTypeEnum = [
  'research',
  'funding',
  'community'
] as const;

// Define the schema
const partnerSchema = new Schema<IPartner>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  logo: {
    type: String,
    default: ''
  },
  website: {
    type: String,
    trim: true,
    default: ''
  },
  description: {
    type: String,
    required: true
  },
  partner_type: {
    type: String,
    required: true,
    enum: partnerTypeEnum
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
partnerSchema.virtual('id').get(function(this: IPartner) {
  return this._id.toHexString();
});

// Ensure virtual fields are serialized
partnerSchema.set('toJSON', {
  virtuals: true,
  transform: (doc: IPartner, ret) => {
    const plain = ret as unknown as Record<string, unknown>;
    delete plain._id;
    delete plain.__v;
    return plain;
  }
});

export const Partner =
  (mongoose.models && mongoose.models['Partner'] as mongoose.Model<IPartner>) ||
  mongoose.model<IPartner>('Partner', partnerSchema);
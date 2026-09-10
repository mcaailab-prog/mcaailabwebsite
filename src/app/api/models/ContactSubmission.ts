import mongoose, { Schema, Document } from 'mongoose';

// Define TypeScript interface for ContactSubmission
export interface IContactSubmission extends Document {
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define the schema
const contactSubmissionSchema = new Schema<IContactSubmission>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for frontend compatibility - convert _id to id
contactSubmissionSchema.virtual('id').get(function(this: IContactSubmission) {
  return this._id.toHexString();
});

// Ensure virtual fields are serialized
contactSubmissionSchema.set('toJSON', {
  virtuals: true,
  transform: (doc: IContactSubmission, ret: any) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

export const ContactSubmission =
  (mongoose.models && mongoose.models['ContactSubmission']) ||
  mongoose.model<IContactSubmission>('ContactSubmission', contactSubmissionSchema);
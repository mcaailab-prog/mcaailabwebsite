import mongoose, { Schema, Document } from 'mongoose';

export interface ICareerApplication extends Document {
  track_slug?: string;
  track_name?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  affiliation?: string;
  qualifications?: string;
  motivation: string;
  cv_url?: string;
  createdAt: Date;
  updatedAt: Date;
}

const careerApplicationSchema = new Schema<ICareerApplication>({
  track_slug: { type: String, default: '' },
  track_name: { type: String, default: '' },
  first_name: { type: String, required: true, trim: true },
  last_name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: { type: String, default: '' },
  affiliation: { type: String, default: '' },
  qualifications: { type: String, default: '' },
  motivation: { type: String, required: true },
  cv_url: { type: String, default: '' },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

careerApplicationSchema.virtual('id').get(function (this: ICareerApplication) {
  return this._id.toHexString();
});

careerApplicationSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc: ICareerApplication, ret) => {
    const plain = ret as unknown as Record<string, unknown>;
    delete plain._id;
    delete plain.__v;
    return plain;
  },
});

export const CareerApplication =
  (mongoose.models && mongoose.models['CareerApplication']) ||
  mongoose.model<ICareerApplication>('CareerApplication', careerApplicationSchema);

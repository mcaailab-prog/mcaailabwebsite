import mongoose, { Schema, Document } from 'mongoose';

export interface IResearchArea extends Document {
  title: string;
  slug: string;
  category: string;
  summary: string;
  full_description: string;
  status: string;
  cover_image: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const researchAreaSchema = new Schema<IResearchArea>({
  title: { type: String, required: true, unique: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  category: { type: String, required: true, default: 'applied_ai' },
  summary: { type: String, required: true },
  full_description: { type: String, required: true },
  status: { type: String, required: true, default: 'ongoing' },
  cover_image: { type: String, default: '' },
  order: { type: Number, default: 0 },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

researchAreaSchema.virtual('id').get(function (this: IResearchArea) {
  return this._id.toHexString();
});

researchAreaSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc: IResearchArea, ret: Record<string, unknown>) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const ResearchArea =
  (mongoose.models && mongoose.models['ResearchArea']) ||
  mongoose.model<IResearchArea>('ResearchArea', researchAreaSchema);

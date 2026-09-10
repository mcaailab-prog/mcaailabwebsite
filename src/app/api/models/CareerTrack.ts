import mongoose, { Schema, Document } from 'mongoose';

export interface ICareerTrack extends Document {
  name: string;
  slug: string;
  description: string;
  qualifications: string[];
  selection_criteria: string[];
  window_open?: Date;
  window_close?: Date;
  is_accepting: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const careerTrackSchema = new Schema<ICareerTrack>({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  description: { type: String, default: '' },
  qualifications: [{ type: String }],
  selection_criteria: [{ type: String }],
  window_open: { type: Date },
  window_close: { type: Date },
  is_accepting: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

careerTrackSchema.virtual('id').get(function (this: ICareerTrack) {
  return this._id.toHexString();
});

careerTrackSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc: ICareerTrack, ret: any) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const CareerTrack =
  (mongoose.models && mongoose.models['CareerTrack']) ||
  mongoose.model<ICareerTrack>('CareerTrack', careerTrackSchema);

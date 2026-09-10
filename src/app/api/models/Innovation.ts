import mongoose, { Schema, Document } from 'mongoose';

export interface IInnovationUser {
  role: string;
  description: string;
}

export interface IInnovation extends Document {
  name: string;
  slug: string;
  category: string;
  subtitle: string;
  date: string;
  summary: string;
  overview: string;
  description: string;
  impact: string;
  stack: string[];
  features: string[];
  users: IInnovationUser[];
  useCases: string[];
  frontend: string[];
  backend: string[];
  details: string[][];
  access_url: string;
  is_published: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const innovationSchema = new Schema<IInnovation>({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  category: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  date: { type: String, default: '' },
  summary: { type: String, default: '' },
  overview: { type: String, default: '' },
  description: { type: String, default: '' },
  impact: { type: String, default: '' },
  stack: [{ type: String }],
  features: [{ type: String }],
  users: [{
    role: { type: String, default: '' },
    description: { type: String, default: '' },
  }],
  useCases: [{ type: String }],
  frontend: [{ type: String }],
  backend: [{ type: String }],
  details: { type: [[String]], default: [] },
  access_url: { type: String, default: '' },
  is_published: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

innovationSchema.virtual('id').get(function (this: IInnovation) {
  return this._id.toHexString();
});

innovationSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc: IInnovation, ret: Record<string, unknown>) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Innovation =
  (mongoose.models && mongoose.models['Innovation']) ||
  mongoose.model<IInnovation>('Innovation', innovationSchema);

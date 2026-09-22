import mongoose, { Schema, Document } from 'mongoose';

export interface IQuarterlyReport extends Document {
  title: string;
  slug: string;
  year: number;
  quarter: 1 | 2 | 3 | 4;
  cover_image?: string;
  summary?: string;
  body?: string;
  pdf_url?: string;
  published_date?: Date;
  is_published?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const quarterlyReportSchema = new Schema<IQuarterlyReport>({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  year: { type: Number, required: true },
  quarter: { type: Number, required: true, enum: [1,2,3,4] },
  cover_image: { type: String, default: '' },
  summary: { type: String, default: '' },
  body: { type: String, default: '' },
  pdf_url: { type: String, default: '' },
  published_date: { type: Date },
  is_published: { type: Boolean, default: false }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

quarterlyReportSchema.virtual('id').get(function(this: IQuarterlyReport) { return this._id.toHexString(); });
quarterlyReportSchema.set('toJSON', { virtuals: true, transform: (doc: IQuarterlyReport, ret) => { const plain = ret as unknown as Record<string, unknown>; delete plain._id; delete plain.__v; return plain; } });

export const QuarterlyReport =
  (mongoose.models && mongoose.models['QuarterlyReport']) ||
  mongoose.model<IQuarterlyReport>('QuarterlyReport', quarterlyReportSchema);

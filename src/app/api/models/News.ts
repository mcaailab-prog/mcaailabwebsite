import mongoose, { Schema, Document } from 'mongoose';

export interface INews extends Document {
  title: string;
  slug: string;
  category: string;
  author: string;
  summary?: string;
  cover_image?: string;
  body: string;
  published_date: Date;
  is_published: boolean;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const newsSchema = new Schema<INews>({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  category: { type: String, required: true, default: 'news' },
  author: { type: String, default: '' },
  summary: { type: String, default: '' },
  cover_image: { type: String, default: '' },
  body: { type: String, required: true },
  published_date: { type: Date, required: true },
  is_published: { type: Boolean, default: true },
  tags: [{ type: String }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create text index for text search functionality
newsSchema.index({
  title: 'text',
  summary: 'text',
  body: 'text'
});

newsSchema.virtual('id').get(function(this: INews) { return this._id.toHexString(); });
newsSchema.set('toJSON', { virtuals: true, transform: (doc: INews, ret) => { const plain = ret as unknown as Record<string, unknown>; delete plain._id; delete plain.__v; return plain; } });

export const News =
  (mongoose.models && mongoose.models['News']) ||
  mongoose.model<INews>('News', newsSchema);

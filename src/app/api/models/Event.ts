import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  slug: string;
  category: string;
  author?: string;
  summary?: string;
  cover_image?: string;
  body?: string;
  start_date: Date;
  end_date?: Date;
  location?: string;
  is_online?: boolean;
  status: 'upcoming' | 'ongoing' | 'past'| 'featured';
  is_featured?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new Schema<IEvent>({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  category: { type: String, required: true, default: 'event' },
  author: { type: String, default: '' },
  summary: { type: String, default: '' },
  cover_image: { type: String, default: '' },
  body: { type: String, default: '' },
  start_date: { type: Date, required: true },
  end_date: { type: Date },
  location: { type: String, default: '' },
  is_online: { type: Boolean, default: false },
  status: { type: String, enum: ['upcoming', 'ongoing', 'past', 'featured'], default: 'upcoming' },
  is_featured: { type: Boolean, default: false }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

eventSchema.virtual('id').get(function(this: IEvent) { return this._id.toHexString(); });
eventSchema.set('toJSON', { virtuals: true, transform: (doc: IEvent, ret) => { const plain = ret as unknown as Record<string, unknown>; delete plain._id; delete plain.__v; return plain; } });

export const Event =
  (mongoose.models && mongoose.models['Event']) ||
  mongoose.model<IEvent>('Event', eventSchema);

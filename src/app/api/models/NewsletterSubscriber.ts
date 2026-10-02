import mongoose, { Schema, Document } from 'mongoose';

export interface INewsletterSubscriber extends Document {
  email: string;
  source: string;
  status: 'active' | 'unsubscribed';
  createdAt: Date;
  updatedAt: Date;
}

const newsletterSubscriberSchema = new Schema<INewsletterSubscriber>({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    unique: true,
  },
  source: {
    type: String,
    required: true,
    trim: true,
    default: 'site-footer',
  },
  status: {
    type: String,
    enum: ['active', 'unsubscribed'],
    default: 'active',
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

newsletterSubscriberSchema.virtual('id').get(function(this: INewsletterSubscriber) {
  return this._id.toHexString();
});

newsletterSubscriberSchema.set('toJSON', {
  virtuals: true,
  transform: (doc: INewsletterSubscriber, ret) => {
    const plain = ret as unknown as Record<string, unknown>;
    delete plain._id;
    delete plain.__v;
    return plain;
  },
});

export const NewsletterSubscriber =
  (mongoose.models && mongoose.models['NewsletterSubscriber']) ||
  mongoose.model<INewsletterSubscriber>('NewsletterSubscriber', newsletterSubscriberSchema);

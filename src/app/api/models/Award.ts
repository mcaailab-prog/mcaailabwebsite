import mongoose, { Schema, Document } from 'mongoose';

export interface IAward extends Document {
  title: string;
  slug: string;
  summary?: string;
  cover_image?: string;
  body?: string;
  award_type?: string;
  recipient?: string;
  recipient_profile?: string;
  organisation?: string;
  event?: string;
  published_date?: Date;
  is_published: boolean;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const awardSchema = new Schema<IAward>({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  summary: { type: String, default: '' },
  cover_image: { type: String, default: '' },
  body: { type: String, default: '' },
  award_type: { type: String, default: '' },
  recipient: { type: String, default: '' },
  recipient_profile: { type: String, default: '' },
  organisation: { type: String, default: '' },
  event: { type: String, default: '' },
  published_date: { type: Date },
  is_published: { type: Boolean, default: true },
  tags: [{ type: String }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

awardSchema.virtual('id').get(function(this: IAward) { return this._id.toHexString(); });
awardSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc: IAward, ret) => {
    const plain = ret as unknown as Record<string, unknown>;
    delete plain._id;
    delete plain.__v;
    return plain;
  },
});

export const Award =
  (mongoose.models && mongoose.models['Award']) ||
  mongoose.model<IAward>('Award', awardSchema);

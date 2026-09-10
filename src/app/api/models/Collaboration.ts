import mongoose, { Schema, Document } from 'mongoose';

export interface ICollaborationObjective {
  n: string;
  title: string;
  body: string;
  accent?: string;
}

export interface ICollaboration extends Document {
  title: string;
  slug: string;
  partner: string;
  summary: string;
  body: string;
  contribution_heading?: string;
  contribution_body?: string;
  cover_image?: string;
  objectives: ICollaborationObjective[];
  stat_value?: string;
  stat_label?: string;
  stat_description?: string;
  evidence_items: string[];
  cta_heading?: string;
  cta_body?: string;
  links: { label: string; href: string }[];
  related_project_slug?: string;
  is_published: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const collaborationSchema = new Schema<ICollaboration>({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  partner: { type: String, default: '' },
  summary: { type: String, default: '' },
  body: { type: String, default: '' },
  contribution_heading: { type: String, default: '' },
  contribution_body: { type: String, default: '' },
  cover_image: { type: String, default: '' },
  objectives: [{
    n: { type: String, default: '' },
    title: { type: String, default: '' },
    body: { type: String, default: '' },
    accent: { type: String, default: 'primary' },
  }],
  stat_value: { type: String, default: '' },
  stat_label: { type: String, default: '' },
  stat_description: { type: String, default: '' },
  evidence_items: [{ type: String }],
  cta_heading: { type: String, default: '' },
  cta_body: { type: String, default: '' },
  links: [{
    label: { type: String, default: '' },
    href: { type: String, default: '' },
  }],
  related_project_slug: { type: String, default: '' },
  is_published: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

collaborationSchema.virtual('id').get(function (this: ICollaboration) {
  return this._id.toHexString();
});

collaborationSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc: ICollaboration, ret: Record<string, unknown>) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Collaboration =
  (mongoose.models && mongoose.models['Collaboration']) ||
  mongoose.model<ICollaboration>('Collaboration', collaborationSchema);

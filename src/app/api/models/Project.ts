import mongoose, { Schema, Document } from 'mongoose';

export interface IProjectLink {
  label: string;
  href: string;
}

export interface IProjectOutcome {
  aim?: string;
  context?: string;
  tasks?: string;
  success?: string;
}

export interface IProject extends Document {
  title: string;
  slug: string;
  subtitle?: string;
  short_title?: string;
  description: string;
  sector: string;
  status: string;
  start_date?: Date;
  end_date?: Date;
  cover_image: string;
  focus: string[];
  outcome: IProjectOutcome;
  lead_name?: string;
  member_names: string[];
  funder_names: string[];
  links: IProjectLink[];
  is_published: boolean;
  order: number;
  research_areas: mongoose.Types.ObjectId[];
  team_members: mongoose.Types.ObjectId[];
  partners: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  subtitle: { type: String, default: '' },
  short_title: { type: String, default: '' },
  description: { type: String, required: true },
  sector: { type: String, default: 'language' },
  status: { type: String, default: 'Ongoing' },
  start_date: { type: Date },
  end_date: { type: Date },
  cover_image: { type: String, default: '' },
  focus: [{ type: String }],
  outcome: {
    aim: { type: String, default: '' },
    context: { type: String, default: '' },
    tasks: { type: String, default: '' },
    success: { type: String, default: '' },
  },
  lead_name: { type: String, default: '' },
  member_names: [{ type: String }],
  funder_names: [{ type: String }],
  links: [{
    label: { type: String, default: '' },
    href: { type: String, default: '' },
  }],
  is_published: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  research_areas: [{ type: Schema.Types.ObjectId, ref: 'ResearchArea' }],
  team_members: [{ type: Schema.Types.ObjectId, ref: 'TeamMember' }],
  partners: [{ type: Schema.Types.ObjectId, ref: 'Partner' }],
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

projectSchema.index({ title: 'text', description: 'text', subtitle: 'text' });

projectSchema.virtual('id').get(function (this: IProject) {
  return this._id.toHexString();
});

projectSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc: IProject, ret) => {
    const plain = ret as unknown as Record<string, unknown>;
    delete plain._id;
    delete plain.__v;
    return plain;
  },
});

export const Project =
  (mongoose.models && mongoose.models['Project'] as mongoose.Model<IProject>) ||
  mongoose.model<IProject>('Project', projectSchema);

import mongoose, { Schema, Document } from 'mongoose';

// Define TypeScript interface for Publication
export interface IPublication extends Document {
  title: string;
  authors: string;
  team_authors?: mongoose.Types.ObjectId[];
  year: number;
  venue: string;
  abstract: string;
  pdf_file: string;
  publication_type: string;
  category: string;
  is_open_access: boolean;
  url: string;
  doi: string | null;
  research_areas: mongoose.Types.ObjectId[];
  projects: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

// Define the schema
const publicationSchema = new Schema<IPublication>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  authors: {
    type: String,
    required: true,
    trim: true
  },
  year: {
    type: Number,
    required: true,
    min: 1900,
    max: new Date().getFullYear() + 1
  },
  venue: {
    type: String,
    required: true,
    trim: true
  },
  abstract: {
    type: String,
    required: true
  },
  pdf_file: {
    type: String,
    default: ''
  },
  publication_type: {
    type: String,
    default: 'Research Paper'
  },
  category: {
    type: String,
    default: 'Research'
  },
  is_open_access: {
    type: Boolean,
    default: true
  },
  url: {
    type: String,
    default: ''
  },
  doi: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    default: undefined
  },
  // Link to TeamMember docs when an author is a team member
  team_authors: [{
    type: Schema.Types.ObjectId,
    ref: 'TeamMember'
  }],
  // Relationships
  research_areas: [{
    type: Schema.Types.ObjectId,
    ref: 'ResearchArea'
  }],
  projects: [{
    type: Schema.Types.ObjectId,
    ref: 'Project'
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create text index for text search functionality
publicationSchema.index({
  title: 'text',
  authors: 'text',
  abstract: 'text',
  venue: 'text'
});

// Virtual for frontend compatibility - convert _id to id
publicationSchema.virtual('id').get(function(this: IPublication) {
  return this._id.toHexString();
});

// Ensure virtual fields are serialized
publicationSchema.set('toJSON', {
  virtuals: true,
  transform: (doc: any, ret: any) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

// Populate virtuals for frontend compatibility
publicationSchema.virtual('research_areas_populated', {
  ref: 'ResearchArea',
  localField: 'research_areas',
  foreignField: '_id',
  justOne: false
});

publicationSchema.virtual('projects_populated', {
  ref: 'Project',
  localField: 'projects',
  foreignField: '_id',
  justOne: false
});

export const Publication =
  (mongoose.models && mongoose.models['Publication']) ||
  mongoose.model<IPublication>('Publication', publicationSchema);
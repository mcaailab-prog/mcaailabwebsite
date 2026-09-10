import mongoose, { Schema, Document } from 'mongoose';

// Define TypeScript interface for TeamMember
export interface ITeamMember extends Document {
  name: string;
  slug: string;
  title: string;
  bio: string;
  photo: string;
  email: string;
  linkedin: string;
  google_scholar: string;
  research_interests: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

// Define the schema
const teamMemberSchema = new Schema<ITeamMember>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  bio: {
    type: String,
    required: true
  },
  photo: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    required: false,
    lowercase: true,
    trim: true,
    default: ''
  },
  linkedin: {
    type: String,
    default: ''
  },
  google_scholar: {
    type: String,
    default: ''
  },
  research_interests: {
    type: String,
    default: ''
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for frontend compatibility - convert _id to id
teamMemberSchema.virtual('id').get(function(this: ITeamMember) {
  return this._id.toHexString();
});

// Ensure virtual fields are serialized
teamMemberSchema.set('toJSON', {
  virtuals: true,
  transform: (doc: ITeamMember, ret: any) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

export const TeamMember =
  (mongoose.models && mongoose.models['TeamMember'] as mongoose.Model<ITeamMember>) ||
  mongoose.model<ITeamMember>('TeamMember', teamMemberSchema);
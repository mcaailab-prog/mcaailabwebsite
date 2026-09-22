import mongoose, { Schema, Document } from 'mongoose';

// Define TypeScript interface for Dataset
export interface IDataset extends Document {
  name: string;
  slug: string;
  language: string;
  size_description: string;
  format: string;
  license: string;
  description: string;
  download_url: string;
  requires_request: boolean;
  associated_project: mongoose.Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

// Define the schema
const datasetSchema = new Schema<IDataset>({
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
  language: {
    type: String,
    required: true,
    trim: true
  },
  size_description: {
    type: String,
    required: true,
    trim: true
  },
  format: {
    type: String,
    required: true,
    trim: true
  },
  license: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  download_url: {
    type: String,
    default: ''
  },
  requires_request: {
    type: Boolean,
    default: false
  },
  // Relationship - optional reference to Project
  associated_project: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    default: null
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for frontend compatibility - convert _id to id
datasetSchema.virtual('id').get(function(this: IDataset) {
  return this._id.toHexString();
});

// Ensure virtual fields are serialized
datasetSchema.set('toJSON', {
  virtuals: true,
  transform: (doc: IDataset, ret) => {
    const plain = ret as unknown as Record<string, unknown>;
    delete plain._id;
    delete plain.__v;
    return plain;
  }
});

// Populate virtuals for frontend compatibility
datasetSchema.virtual('associated_project_populated', {
  ref: 'Project',
  localField: 'associated_project',
  foreignField: '_id',
  justOne: true
});

export const Dataset =
  (mongoose.models && mongoose.models['Dataset']) ||
  mongoose.model<IDataset>('Dataset', datasetSchema);
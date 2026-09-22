import mongoose, { Schema, Document } from 'mongoose';

// Define TypeScript interface for DatasetAccessRequest
export interface IDatasetAccessRequest extends Document {
  dataset: mongoose.Types.ObjectId;
  name: string;
  email: string;
  institution: string;
  purpose: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define the schema
const datasetAccessRequestSchema = new Schema<IDatasetAccessRequest>({
  // Relationship - reference to Dataset
  dataset: {
    type: Schema.Types.ObjectId,
    ref: 'Dataset',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  institution: {
    type: String
  },
  purpose: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for frontend compatibility - convert _id to id
datasetAccessRequestSchema.virtual('id').get(function(this: IDatasetAccessRequest) {
  return this._id.toHexString();
});

// Ensure virtual fields are serialized
datasetAccessRequestSchema.set('toJSON', {
  virtuals: true,
  transform: (doc: IDatasetAccessRequest, ret) => {
    const plain = ret as unknown as Record<string, unknown>;
    delete plain._id;
    delete plain.__v;
    return plain;
  }
});

// Populate virtuals for frontend compatibility
datasetAccessRequestSchema.virtual('dataset_populated', {
  ref: 'Dataset',
  localField: 'dataset',
  foreignField: '_id',
  justOne: true
});

export const DatasetAccessRequest =
  (mongoose.models && mongoose.models['DatasetAccessRequest']) ||
  mongoose.model<IDatasetAccessRequest>('DatasetAccessRequest', datasetAccessRequestSchema);
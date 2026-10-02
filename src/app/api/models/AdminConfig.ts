import mongoose, { Schema, Document } from 'mongoose';

export interface IAdminConfig extends Document {
  key: string;
  value: string;
  createdAt: Date;
  updatedAt: Date;
}

const adminConfigSchema = new Schema<IAdminConfig>({
  key: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  value: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

export const AdminConfig =
  (mongoose.models && mongoose.models['AdminConfig'] as mongoose.Model<IAdminConfig>) ||
  mongoose.model<IAdminConfig>('AdminConfig', adminConfigSchema);

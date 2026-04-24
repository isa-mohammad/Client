import mongoose, { Schema } from 'mongoose';
import type { Document } from 'mongoose';

export interface IOrganization extends Document {
  name: string;
  description?: string;
}

const OrganizationSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Organization name is required'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  }
}, { timestamps: true });

export default mongoose.model<IOrganization>('Organization', OrganizationSchema);

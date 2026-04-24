import mongoose, { Schema } from 'mongoose';
import type { Document } from 'mongoose';

export interface ITask extends Document {
  user: mongoose.Types.ObjectId;
  organization: mongoose.Types.ObjectId;
  title: string;
  completed: boolean;
  createdAt: Date;
}

const TaskSchema: Schema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: 'Organization'
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// MongoDB Basics: The 'model' is a wrapper for the schema that provides the interface to the database.
export default mongoose.model<ITask>('Task', TaskSchema);

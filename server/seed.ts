import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Task from './models/task.model.js';
import User from './models/user.model.js';

dotenv.config();

const sampleTasks = [
  { title: 'Learn React 19 Compiler', completed: true },
  { title: 'Master ESM Imports in Node.js', completed: true },
  { title: 'Build Premium Task Dashboard', completed: false },
  { title: 'Master MERN Stack Interview', completed: false },
  { title: 'Connect MongoDB to Express', completed: true }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log('✅ Connected to MongoDB for seeding...');

    // Clear existing data (optional but recommended for a clean start)
    await Task.deleteMany({});
    console.log('🧹 Cleared existing tasks.');

    // 1. Find the specific user
    const user = await User.findOne({ email: 'fahimism@gmail.com' });
    
    if (!user) {
      console.log('❌ User fahimism@gmail.com not found. Create them first!');
      process.exit(1);
    }

    // 2. Attach the user's _id to every sample task
    const tasksWithUser = sampleTasks.map((task) => ({
      ...task,
      user: user._id
    }));

    // 3. Insert the relational data
    await Task.insertMany(tasksWithUser);
    console.log(`🚀 Successfully seeded ${tasksWithUser.length} tasks for fahimism@gmail.com!`);

    process.exit();
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();

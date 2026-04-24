import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const fix = async () => {
  try {
    console.log('⏳ Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI!);
    
    console.log('🔍 Attempting to drop the ghost index "username_1"...');
    await mongoose.connection.db!.collection('users').dropIndex('username_1');
    
    console.log('✅ Successfully dropped the ghost username index! 👻');
  } catch (error) {
    console.log('❌ Result: The index "username_1" was not found or already dropped.');
  } finally {
    process.exit();
  }
};

fix();

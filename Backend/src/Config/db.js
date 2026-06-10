import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function connectDB() {
    try {
        await mongoose.connect(process.env.DB_URI);
        console.log('Connected to database');
    } catch (error) {
        console.log('Error connecting to database', error);
    }
}

export default connectDB;
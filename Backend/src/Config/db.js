import mongoose from 'mongoose';


async function connectDB() {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log('Connected to database');
    } catch (error) {
        console.log('Error connecting to database', error);
    }
}

export default connectDB;
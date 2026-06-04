import express from 'express';
import dotenv from 'dotenv';
import connectDB from './src/Config/db.js';


const server = express();


//loads environment variables from .env file
dotenv.config();

connectDB();

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
import dotenv from 'dotenv';
import connectDB from './src/Config/db.js';
import config from './src/Config/config.js';
import app from './src/app.js';

dotenv.config();

connectDB();

app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});
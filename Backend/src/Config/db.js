import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import config from "./config.js";

// connect db function we retry logic
async function connectDB() {
  let retries = 5;
  while (retries > 0) {
    try {
      let conn = await mongoose.connect(config.mongo_uri);
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
      return; // Success - exit the function
    } catch (error) {
      console.error(
        `❌ Connection failed (${retries} attempts left):`,
        error.message,
      );
      retries--;

      if (retries === 0) {
        console.error("All connection attempts failed. Exiting...");
        process.exit(1);
      }
      // Wait 3 seconds before retrying
      console.log(`Waiting 5 seconds before retry...`);
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
}

export default connectDB;

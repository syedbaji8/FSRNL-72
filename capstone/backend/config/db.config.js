import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MAX_RETRIES = 5;
const RETRY_INTERVAL_MS = 5000;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function connectDB() {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      await mongoose.connect(process.env.MONGO_URL);
      console.log("MongoDB Connected");
      return;
    } catch (err) {
      console.error(
        `MongoDB connection attempt ${attempt}/${MAX_RETRIES} failed: ${err.message}`,
      );

      if (attempt === MAX_RETRIES) {
        console.error("All MongoDB connection attempts failed. Exiting.");
        throw err;
      }

      console.log(`Retrying in ${RETRY_INTERVAL_MS / 1000}s...`);
      await wait(RETRY_INTERVAL_MS);
    }
  }
}

export default connectDB;

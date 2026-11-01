import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
//TODO=>run a for loop and make this function run 5 time as retry each having interval of 5 second
async function connectDB() {
  await mongoose.connect(
    "mongodb+srv://vikaskumar20012001_db_user:Vikas123@fsrnl-72.5x8k3ls.mongodb.net/project",
  );
  console.log("MongoDB Connected");
}
export default connectDB;

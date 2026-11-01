import express from "express";
import connectDB from "../config/db.config.js";
import dotenv from "dotenv";

const app = express();
dotenv.config();
const PORT = process.env.PORT || 5000;

connectDB();

app.get("/", (req, res) => {
  res.json({ message: "Hello World!" });
});

export default app;

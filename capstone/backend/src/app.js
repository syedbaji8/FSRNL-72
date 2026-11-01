import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import redisClient from "../config/redis.config.js";

dotenv.config();
const app = express();

app.get("/", (req, res) => {
  res.json({ message: "Hello World!" });
});



export default app;

import dotenv from "dotenv";
import { createClient } from "redis";

dotenv.config();

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 3) {
        return new Error("Redis connection time out");
      }

      return Math.min(retries * 100, 3000);
    },
  },
});
redisClient.on("connect", () => {
  console.log("Redis client connected");
});
redisClient.on("error", (err) => {
  console.error("Redis client error:", err);
});
try {
  await redisClient.connect();
} catch (err) {
  console.error("Redis connection error:", err);
}

export default redisClient;

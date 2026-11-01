import redisClient from "../config/redis.config.js";

const cache = (duration = 60) => {
  return async (req, res, next) => {
    if (req.method !== "GET") return next();

    const key = `cache:${req.originalUrl}`;

    try {
      const cachedData = await redisClient.get(key);

      if (cachedData) {
        return res.status(200).json(JSON.parse(cachedData));
      }

      const originalJson = res.json.bind(res);
      res.json = (body) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          redisClient
            .setEx(key, duration, JSON.stringify(body))
            .catch(() => {});
        }
        return originalJson(body);
      };

      next();
    } catch (err) {
      next();
    }
  };
};

const invalidateCache = async (pattern) => {
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  } catch (err) {
    console.error("Cache invalidation error:", err.message);
  }
};

export { cache, invalidateCache };

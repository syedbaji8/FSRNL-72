import { rateLimit } from "express-rate-limit";

const minutes = (m) => m * 60 * 1000;
const hours = (h) => h * 60 * 60 * 1000;
const days = (d) => d * 24 * 60 * 60 * 1000;

// Shared options so every limiter returns consistent headers/JSON.
const base = {
  standardHeaders: true,
  legacyHeaders: false,
};

const buildMessage = (message) => ({ success: false, message });

/**
 * General fallback limiter for the whole API.
 * Mount on the app/router so no single IP can flood the service.
 */
const globalLimiter = rateLimit({
  ...base,
  windowMs: minutes(15),
  limit: 300,
  message: buildMessage(
    "Too many requests from this IP, please try again later",
  ),
});

/* ------------------------------ Auth ------------------------------ */

// Login: block brute-force credential stuffing.
const loginLimiter = rateLimit({
  ...base,
  windowMs: minutes(15),
  limit: 5,
  skipSuccessfulRequests: true, // only count failed logins
  message: buildMessage(
    "Too many login attempts, please try again after 15 minutes",
  ),
});

// Registration: stop automated signup/spam accounts.
const registerLimiter = rateLimit({
  ...base,
  windowMs: hours(1),
  limit: 5,
  message: buildMessage(
    "Too many accounts created from this IP, please try again later",
  ),
});

// Password reset / OTP / verification emails: expensive + abusable.
const emailLimiter = rateLimit({
  ...base,
  windowMs: hours(1),
  limit: 3,
  message: buildMessage(
    "Too many email requests, please try again after an hour",
  ),
});

/* --------------------------- User profile --------------------------- */

// Profile edits (name, avatar). Keep the original "rare update" intent.
const updateProfileLimiter = rateLimit({
  ...base,
  windowMs: days(15),
  limit: 3,
  message: buildMessage("You can only update your profile a few times a month"),
});

/* ------------------------ Customer ordering ------------------------ */

// Placing orders: allow normal ordering, block runaway/duplicate spam.
const createOrderLimiter = rateLimit({
  ...base,
  windowMs: minutes(10),
  limit: 10,
  message: buildMessage(
    "Too many orders in a short time, please slow down and try again",
  ),
});

// Payment attempts (Razorpay create/verify): tight to deter card testing.
const paymentLimiter = rateLimit({
  ...base,
  windowMs: minutes(15),
  limit: 10,
  message: buildMessage("Too many payment attempts, please try again shortly"),
});

// Submitting ratings/reviews for kitchens and menu items.
const reviewLimiter = rateLimit({
  ...base,
  windowMs: hours(1),
  limit: 20,
  message: buildMessage("Too many reviews submitted, please try again later"),
});

/* ----------------- Kitchen owner / menu management ----------------- */

// Creating/updating kitchens and menu items (owner dashboard writes).
const kitchenWriteLimiter = rateLimit({
  ...base,
  windowMs: minutes(15),
  limit: 60,
  message: buildMessage(
    "Too many kitchen/menu changes, please try again later",
  ),
});

// Image uploads to Cloudinary (kitchen/menu/avatar images): costly.
const uploadLimiter = rateLimit({
  ...base,
  windowMs: minutes(15),
  limit: 30,
  message: buildMessage("Too many uploads, please try again later"),
});

/* ----------------------------- Admin ----------------------------- */

// Admin bulk reads (list all users/orders/kitchens).
const adminReadLimiter = rateLimit({
  ...base,
  windowMs: minutes(15),
  limit: 30,
  message: buildMessage("Too many requests, please slow down"),
});

export {
  globalLimiter,
  loginLimiter,
  registerLimiter,
  emailLimiter,
  updateProfileLimiter,
  createOrderLimiter,
  paymentLimiter,
  reviewLimiter,
  kitchenWriteLimiter,
  uploadLimiter,
  adminReadLimiter,
};

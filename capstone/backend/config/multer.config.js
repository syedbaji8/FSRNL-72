import multer from "multer";

// Use memory storage so files are available as `file.buffer`,
// which uploadImage.utils.js streams directly to Cloudinary.
const storage = multer.memoryStorage();

const upload = multer({ storage });

export default upload;

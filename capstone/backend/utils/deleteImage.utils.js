import cloudinary from "../config/cloudinary.config.js";
const deleteImage = async (publicId) => {
  if (!publicId) {
    throw new Error("Public ID is required");
  }

  const result = await cloudinary.uploader.destroy(publicId);

  return result;
};
export default deleteImage;

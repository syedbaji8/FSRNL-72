import cloudinary from "../config/cloudinary.config";
const uploadImage = (fileBuffer, fodler = "profilepics") => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: fodler }, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      })
      .end(fileBuffer);
  });
};
export default uploadImage;

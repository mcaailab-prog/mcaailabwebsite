import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImage = async (file: File) => {
  const buffer = await file.arrayBuffer();
  const bytes = Buffer.from(buffer);

  return new Promise(async (resolve, reject) => {
    cloudinary.uploader.upload_stream({
      resource_type: 'auto',
    }, (err, result) => {
      if (err) {
        return reject(err.message);
      }
      if (result) {
        return resolve(result.secure_url);
      }
    }).end(bytes);
  });
};

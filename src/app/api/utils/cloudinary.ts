import { v2 as cloudinary } from 'cloudinary';

function missingCloudinaryEnv() {
  return ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'].filter(
    (key) => !process.env[key],
  );
}

export function assertCloudinaryConfigured() {
  const missing = missingCloudinaryEnv();
  if (missing.length) {
    throw new Error(
      `Cloudinary is not configured. Missing ${missing.join(', ')}. Set these in local .env and in Vercel environment variables.`,
    );
  }
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImage = async (file: File): Promise<string> => {
  assertCloudinaryConfigured();

  const buffer = await file.arrayBuffer();
  const bytes = Buffer.from(buffer);

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        resource_type: 'auto',
        folder: 'mcaai',
      },
      (err, result) => {
        if (err) {
          return reject(new Error(err.message || 'Cloudinary upload failed'));
        }
        if (result?.secure_url) {
          return resolve(result.secure_url);
        }
        return reject(new Error('Cloudinary did not return a secure_url'));
      },
    ).end(bytes);
  });
};

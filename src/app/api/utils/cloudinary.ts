import { v2 as cloudinary } from 'cloudinary';

function parseCloudinaryUrl(url: string | undefined) {
  if (!url) return null;

  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'cloudinary:') return null;

    const username = parsed.username || '';
    const password = parsed.password || '';
    const cloudName = parsed.hostname || '';

    if (!username || !password || !cloudName) return null;

    return {
      cloud_name: cloudName,
      api_key: username,
      api_secret: password,
    };
  } catch {
    return null;
  }
}

export function resolveCloudinaryConfig() {
  const fromUrl = parseCloudinaryUrl(process.env.CLOUDINARY_URL);
  const config = {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || fromUrl?.cloud_name,
    api_key: process.env.CLOUDINARY_API_KEY || fromUrl?.api_key,
    api_secret: process.env.CLOUDINARY_API_SECRET || fromUrl?.api_secret,
  };

  return config;
}

function missingCloudinaryEnv() {
  const config = resolveCloudinaryConfig();
  return ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET']
    .filter((key) => !process.env[key])
    .concat(
      !config.cloud_name || !config.api_key || !config.api_secret ? ['CLOUDINARY_URL'] : [],
    )
    .filter((value, index, arr) => arr.indexOf(value) === index);
}

export function assertCloudinaryConfigured() {
  const config = resolveCloudinaryConfig();
  const missing = missingCloudinaryEnv();
  if (missing.length || !config.cloud_name || !config.api_key || !config.api_secret) {
    throw new Error(
      `Cloudinary is not configured. Missing ${missing.join(', ') || 'Cloudinary credentials'}. Set CLOUDINARY_URL or the CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET values in local .env and in Vercel environment variables.`,
    );
  }
}

const config = resolveCloudinaryConfig();
cloudinary.config({
  cloud_name: config.cloud_name,
  api_key: config.api_key,
  api_secret: config.api_secret,
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

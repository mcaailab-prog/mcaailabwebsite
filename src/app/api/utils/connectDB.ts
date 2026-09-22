import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
// Load .env for server runtime when environment variables are not provided
dotenv.config();
// Ensure all models are registered on the mongoose instance early.
import '@/app/api/models';

let connectPromise: Promise<boolean> | null = null;

const isConnected = () => mongoose.connection.readyState === 1;

const waitForPendingConnection = async (): Promise<boolean> => {
  if (mongoose.connection.readyState !== 2) {
    return false;
  }

  console.log('MongoDB connection is pending, waiting for connection...');
  try {
    await mongoose.connection.asPromise();
    if (isConnected()) {
      console.log('MongoDB connected after pending state');
      return true;
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`MongoDB pending connect error: ${message}`);
  }

  return false;
};

export const connectDB = async (): Promise<boolean> => {
  if (isConnected()) {
    try {
      if (mongoose.connection.db) {
        await mongoose.connection.db.admin().ping();
      }
      console.log('MongoDB already connected');
      return true;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.warn(`MongoDB ping failed, reconnecting: ${message}`);
      try {
        await mongoose.disconnect();
      } catch {
        // ignore disconnect errors
      }
    }
  }

  if (connectPromise) {
    return connectPromise;
  }

  connectPromise = (async (): Promise<boolean> => {
    if (await waitForPendingConnection()) {
      connectPromise = null;
      return true;
    }

    const uri = process.env.MONGODB_URI;
    if (!uri) {
      console.error('MongoDB connection error: MONGODB_URI is not defined');
      connectPromise = null;
      return false;
    }

    try {
        if (mongoose.connection.readyState === 3) {
          await mongoose.disconnect();
        }

        // Retry loop: attempt to connect a few times before giving up.
        const maxAttempts = 3;
        let attempt = 0;
        while (attempt < maxAttempts) {
          attempt += 1;
          try {
            const conn = await mongoose.connect(uri, {
              bufferCommands: false,
              serverSelectionTimeoutMS: 10000,
              socketTimeoutMS: 45000,
            });
            console.log(`MongoDB Connected: ${conn.connection.host}`);
            connectPromise = null;
            return true;
          } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.warn(`MongoDB connect attempt ${attempt} failed: ${message}`);
            // If we've exhausted attempts, rethrow the error to be handled below.
            if (attempt >= maxAttempts) {
              throw err;
            }
            // Small backoff before retrying
            await new Promise((res) => setTimeout(res, 500 * attempt));
          }
        }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`MongoDB Connection Error: ${message}`);
      connectPromise = null;
      return false;
    }

    // If we somehow exit the retry loop without returning, ensure a boolean is returned.
    connectPromise = null;
    return false;
  })();

  return connectPromise;
};

export const checkDBConnection = async (): Promise<boolean> => {
  return isConnected();
};
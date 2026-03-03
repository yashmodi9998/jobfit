import mongoose from 'mongoose';
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

/**
 * We define a specific interface for our cached connection 
 * to avoid using 'any'.
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development.
 */
declare global {
  var mongoose: MongooseCache | undefined;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect(): Promise<typeof mongoose> {
  // Check if we have a connection AND if it's actually "connected" (readyState 1)
  if (cached!.conn && mongoose.connection.readyState === 1) {
    console.log("Using active MongoDB connection");
    return cached!.conn;
  }

  // If the connection is broken, reset the promise and try again
  if (!cached!.promise || mongoose.connection.readyState !== 1) {
    console.log("No active connection. Starting new connection...");
    
    const opts = {
      bufferCommands: true, // Let it buffer for a bit while connecting
      serverSelectionTimeoutMS: 5000, // Fail fast (5s) instead of 30s
    };

    cached!.promise = mongoose.connect(MONGODB_URI!, opts).then((m) => {
      console.log("New connection established!");
      return m;
    });
  }

  try {
    cached!.conn = await cached!.promise;
  } catch (e) {
    cached!.promise = null;
    console.error("Connection failed:", e);
    throw e;
  }

  return cached!.conn;
}

export default dbConnect;
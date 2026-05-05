// MongoDB connection helper for AlumniConnect backend.
// Exposes connectDatabase() to initialize a shared mongoose connection.
import mongoose from "mongoose";

export const connectDatabase = async () => {
  const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/alumniConnectDB";

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  await mongoose.connect(mongoUri);
  return mongoose.connection;
};

import mongoose from "mongoose";

const url: string | undefined = process.env.MONGO_URI;
if (!url) {
  throw new Error("MONGO_URI is not defined in environment variables");
}

let isConnected = false; // Track connection status

const connectDB = async () => {
  if (isConnected) {
    console.log("Using existing database connection");
    return;
  }

  try {
    const db = await mongoose.connect(url, {
      dbName: "test", // Ensure this matches your database name in Compass
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as any);

    isConnected = true;
    console.log("Connected to MongoDB");
    return db;
    
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw new Error("Failed to connect to MongoDB");
  }
  
};

export default connectDB;

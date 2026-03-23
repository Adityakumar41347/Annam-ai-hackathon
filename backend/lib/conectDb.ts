
import mongoose from "mongoose";
import process from "process";

export default async function ConnectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("MONGO_URI not found");

  try {
    await mongoose.connect(uri);
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ Connection error:", err);
    throw err;
  }
}

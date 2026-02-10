require("dotenv").config();
import mongoose from "mongoose";
import { User } from "../schema/user";
import { Paste } from "../schema/paste";

export const connectToDatabase = async () => {
  try {
    const db = await mongoose.connect(process.env.DATABASE_URL!);
    console.log("Database connected");

    await User.createCollection();
    await Paste.createCollection();

    return db;
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};

export const disconnectFromDatabase = async () => {
  try {
    await mongoose.disconnect();
    console.log("Database disconnected");
    process.exit(0);
  } catch (error) {
    console.error("Database disconnection error:", error);
  }
};

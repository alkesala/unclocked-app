import mongoose from "mongoose"
import { logger } from "./logger"

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI!)
    logger.info(`MongoDB connected!`, conn)
  } catch (err) {
    logger.error("mongoDB connection failed", err)
    process.exit(1)
  }
}

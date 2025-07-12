import { logger } from "@/utils/logger"
import mongoose from "mongoose"

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI!)
        logger.info(`MongoDB connected!`, conn)
    } catch (err) {
        logger.error("mongoDB connection failed", err)
        process.exit(1)
    }
}

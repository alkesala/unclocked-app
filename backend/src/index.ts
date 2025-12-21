import { jwtAuth } from "@/middleware/jwt-auth"
import { requestLogger } from "@/middleware/request-logger"
import { unknownEndpoint } from "@/middleware/unknown-endpoint"
import { AuthRouter } from "@/modules/auth/auth.route"
import { ReportRouter } from "@/modules/reports/reports.route"
import { statusRouter } from "@/modules/status/status.route"
import { TimeEntryRouter } from "@/modules/timeEntry/timeEntry.route"
import { connectDB } from "@/utils/db"
import { logger } from "@/utils/logger"
import cors from "cors"
import dotenv from "dotenv"
import express from "express"
import http from "http"
import { ProjectRouter } from "./modules/project/project.route"
dotenv.config()

const app = express()

// CORS configuration
app.use(
    cors({
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        credentials: true,
    })
)

app.use(express.json())
app.use(requestLogger)

// use env
const PORT = process.env.PORT
// eslint-disable-next-line @typescript-eslint/no-misused-promises
const server = http.createServer(app)

// Routes go down here;
const apiRouter = express.Router()

// Public routes (no authentication required)
apiRouter.use("/auth", AuthRouter)
apiRouter.use(statusRouter)

// Protected routes (require JWT authentication)
apiRouter.use(jwtAuth)
apiRouter.use("/project", ProjectRouter)
apiRouter.use(TimeEntryRouter)
apiRouter.use("/reports", ReportRouter)

app.use("/api/v1", apiRouter)

// fallback for unknown endpoints
app.use(unknownEndpoint)

connectDB()
    .then(() => {
        server.listen(PORT, () => {
            logger.info(`Server running on port: ${PORT}`)
        })
    })
    .catch((err) => {
        logger.error("Failed to connect to database:", err)
        process.exit(1)
    })

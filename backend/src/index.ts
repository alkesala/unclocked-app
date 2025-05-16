import express from "express"
import dotenv from "dotenv"
import { requestLogger } from "@/middleware/request-logger"
import http from "http"
import { statusRouter } from "@/modules/status/status.route"
import { logger } from "@/utils/logger"
import { unknownEndpoint } from "@/middleware/unknown-endpoint"
import { connectDB } from "@/utils/db"
import { TimeEntryRouter } from "@/modules/timeEntry/timeEntry.route"

dotenv.config()
const app = express()

app.use(express.json())
app.use(requestLogger)

// use env
const PORT = process.env.PORT

const server = http.createServer(app)

// Routes go down here;
const apiRouter = express.Router()

apiRouter.use(statusRouter)

apiRouter.use("/time", TimeEntryRouter)

app.use("/api/v1", apiRouter)

// fallback for unknown endpoints
app.use(unknownEndpoint)

connectDB()
server.listen(PORT, () => {
    logger.info(`Server running on port: ${PORT}`)
})

import { fakeOAuth } from "@/middleware/fake-oauth"
import { requestLogger } from "@/middleware/request-logger"
import { unknownEndpoint } from "@/middleware/unknown-endpoint"
import { ReportRouter } from "@/modules/reports/reports.route"
import { statusRouter } from "@/modules/status/status.route"
import { TimeEntryRouter } from "@/modules/timeEntry/timeEntry.route"
import { connectDB } from "@/utils/db"
import { logger } from "@/utils/logger"
import dotenv from "dotenv"
import express from "express"
import http from "http"
import { ProjectRouter } from "./modules/project/project.route"
dotenv.config()

const app = express()
app.use(fakeOAuth)
app.use(express.json())
app.use(requestLogger)

// use env
const PORT = process.env.PORT

const server = http.createServer(app)

// Routes go down here;
const apiRouter = express.Router()

apiRouter.use(statusRouter)
apiRouter.use("/project", ProjectRouter)
apiRouter.use("/time", TimeEntryRouter)
apiRouter.use("/reports", ReportRouter)

app.use("/api/v1", apiRouter)

// fallback for unknown endpoints
app.use(unknownEndpoint)

connectDB()
server.listen(PORT, () => {
    logger.info(`Server running on port: ${PORT}`)
})

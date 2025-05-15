import express from "express";
import dotenv from "dotenv";
import { requestLogger } from "./middleware/requestLogger";
import http from "http";
import { statusRouter } from "./modules/status/status.route";
import { logger } from "./utils/logger";
import { unknownEndpoint } from "./middleware/unknown-endpoint";

dotenv.config();
const app = express();
app.use(requestLogger);

const PORT = process.env.PORT || 3001;

const server = http.createServer(app);

// Routes go down here;

const apiRouter = express.Router();

apiRouter.use(statusRouter);
app.use("/api/v1", apiRouter);
app.use(express.json());

app.use(unknownEndpoint);

server.listen(PORT, () => {
    logger.info(`Server running on port: ${PORT}`);
});

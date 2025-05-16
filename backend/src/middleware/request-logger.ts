import { NextFunction, Request, Response } from "express"
import { logger } from "../utils/logger"

export const requestLogger = (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    const start = Date.now()

    response.on("close", () => {
        const duration = Date.now() - start

        if (response.statusCode >= 500) {
            logger.warn(
                `${request.method} ${request.originalUrl} - ${response.statusCode} - ${duration}ms`
            )
        } else if (response.statusCode >= 400 && response.statusCode < 500) {
            logger.error(
                `${request.method} ${request.originalUrl} - ${response.statusCode} - ${duration}ms`
            )
        } else {
            if (request.method === "POST") {
                logger.info(
                    `${request.method} ${request.originalUrl} - ${response.statusCode} - ${duration}ms - ${request.body}`
                )
            } else {
                logger.info(
                    `${request.method} ${request.originalUrl} - ${response.statusCode} - ${duration}ms`
                )
            }
        }
    })

    next()
}

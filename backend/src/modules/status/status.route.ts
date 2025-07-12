import { Router } from "express"
import { statusController } from "./status.controller"

export const statusRouter = Router()

/**
 * @swagger
 * /status:
 *   get:
 *     summary: Get API status
 *     description: Check the health and status of the API
 *     tags: [Status]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: API status information
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StatusResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
statusRouter.get("/status", statusController.getStatus)

/**
 * @swagger
 * /test-account:
 *   get:
 *     summary: Test authentication
 *     description: Test the authentication middleware and get current user information
 *     tags: [Status]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user account information
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TestAccountResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
statusRouter.get("/test-account", (req, res) => {
    res.json({
        accountId: req.accountId,
        user: req.user,
    })
})

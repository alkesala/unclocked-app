import validator from "@/middleware/validator"
import { Router } from "express"
import { ReportController } from "./reports.controller"
import { ReportsValidator } from "@shared/types/report"

export const ReportRouter = Router()

/**
 * @swagger
 * /reports:
 *   get:
 *     summary: Get all reports
 *     description: Retrieve a paginated list of reports with optional filtering
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/page'
 *       - $ref: '#/components/parameters/limit'
 *       - $ref: '#/components/parameters/sortby'
 *       - $ref: '#/components/parameters/orderby'
 *       - $ref: '#/components/parameters/projectId'
 *     responses:
 *       200:
 *         description: List of reports
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Report'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
ReportRouter.get(
    "/",
    validator(ReportsValidator.getReportsSchema),
    ReportController.getReports
)

/**
 * @swagger
 * /reports:
 *   post:
 *     summary: Create a new report
 *     description: Create a new report for a specific time range and project
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateReportRequest'
 *     responses:
 *       201:
 *         description: Report created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Report'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
ReportRouter.post(
    "/",
    validator(ReportsValidator.createReportSchema),
    ReportController.createReport
)

/**
 * @swagger
 * /reports/{id}:
 *   delete:
 *     summary: Delete a report
 *     description: Delete a report by ID
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/reportId'
 *     responses:
 *       200:
 *         description: Report deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Report deleted successfully"
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Report not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
ReportRouter.delete(
    "/:id",
    validator(ReportsValidator.deleteReportByIdSchema),
    ReportController.deleteReportById
)

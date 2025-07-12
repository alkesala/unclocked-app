import validator from "@/middleware/validator"
import { TimeEntryValidator } from "@shared/types/timeEntry"
import { Router } from "express"
import { TimeEntryController } from "./timeEntry.controller"

export const TimeEntryRouter = Router()

/**
 * @swagger
 * /time:
 *   post:
 *     summary: Create a new time entry
 *     description: Create a new time entry with start time, project, and optional details
 *     tags: [Time Entries]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTimeEntryRequest'
 *     responses:
 *       201:
 *         description: Time entry created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/TimeEntry'
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
/**
 * @swagger
 * /time/start:
 *   post:
 *     summary: Start a new time entry timer
 *     description: Start a new time tracking timer for a project
 *     tags: [Time Entries]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               project:
 *                 type: string
 *                 description: Project ID (24-character MongoDB ObjectId)
 *                 example: "507f1f77bcf86cd799439011"
 *               note:
 *                 type: string
 *                 description: Optional note about the time entry
 *                 example: "Working on feature implementation"
 *               hourlyRate:
 *                 type: number
 *                 description: Optional hourly rate override
 *                 example: 50
 *             required:
 *               - project
 *     responses:
 *       201:
 *         description: Timer started successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/TimeEntry'
 *       400:
 *         description: Bad request or active timer exists
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
TimeEntryRouter.post(
    "/start",
    validator(TimeEntryValidator.startTimeEntrySchema),
    TimeEntryController.startTimeEntry
)

/**
 * @swagger
 * /time:
 *   post:
 *     summary: Create a new time entry
 *     description: Create a new time entry with start time, project, and optional details
 *     tags: [Time Entries]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTimeEntryRequest'
 *     responses:
 *       201:
 *         description: Time entry created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/TimeEntry'
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
TimeEntryRouter.post(
    "/",
    validator(TimeEntryValidator.createTimeEntrySchema),
    TimeEntryController.createTimeEntry
)

/**
 * @swagger
 * /time:
 *   get:
 *     summary: Get all time entries
 *     description: Retrieve a paginated list of time entries with optional filtering
 *     tags: [Time Entries]
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
 *         description: List of time entries
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TimeEntry'
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
/**
 * @swagger
 * /time/active:
 *   get:
 *     summary: Get active time entry timer
 *     description: Get the currently active time entry timer if one exists
 *     tags: [Time Entries]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Active timer found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   allOf:
 *                     - $ref: '#/components/schemas/TimeEntry'
 *                     - type: object
 *                       properties:
 *                         currentDuration:
 *                           type: number
 *                           description: Current duration in hours (for active timer)
 *                           example: 2.5
 *       404:
 *         description: No active timer found
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
 */
TimeEntryRouter.get("/active", TimeEntryController.getActiveTimer)

TimeEntryRouter.get(
    "/",
    validator(TimeEntryValidator.getAllEntriesSchema),
    TimeEntryController.getEntries
)
/**
 * @swagger
 * /time/{id}:
 *   delete:
 *     summary: Delete a time entry
 *     description: Delete a time entry by ID
 *     tags: [Time Entries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/timeEntryId'
 *     responses:
 *       200:
 *         description: Time entry deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Time entry deleted successfully"
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
 *         description: Time entry not found
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
TimeEntryRouter.delete(
    "/:id",
    validator(TimeEntryValidator.deleteByIdSchema),
    TimeEntryController.deleteTimeEntry
)
/**
 * @swagger
 * /time/end/{id}:
 *   patch:
 *     summary: End a time entry timer
 *     description: End an ongoing time entry timer by setting the end time
 *     tags: [Time Entries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/timeEntryId'
 *     responses:
 *       200:
 *         description: Timer ended successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/TimeEntry'
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
 *         description: Time entry not found
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
TimeEntryRouter.patch(
    "/end/:id",
    validator(TimeEntryValidator.endTimeEntrySchema),
    TimeEntryController.endTimeEntry
)

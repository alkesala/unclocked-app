import validator from "@/middleware/validator"
import { Router } from "express"
import { TimeEntryController } from "./timeEntry.controller"
import { TimeEntryValidator } from "@shared/types/timeEntry"

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
 *     summary: End a time entry
 *     description: End an ongoing time entry by setting the end time
 *     tags: [Time Entries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/timeEntryId'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EndTimeEntryRequest'
 *     responses:
 *       200:
 *         description: Time entry ended successfully
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

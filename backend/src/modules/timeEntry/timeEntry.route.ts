import { Router } from "express"
import { TimeEntryController } from "./timeEntry.controller"
import validator from "../../middleware/validator"
import { createTimeEntrySchema } from "./timeEntry.validator"

export const TimeEntryRouter = Router()

TimeEntryRouter.post(
    "/create-entry",
    validator(createTimeEntrySchema),
    TimeEntryController.createTimeEntry
)

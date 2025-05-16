import { Router } from "express"
import { TimeEntryController } from "./timeEntry.controller"
import validator from "../../middleware/validator"
import { timeEntryValidator } from "./timeEntry.validator"

export const TimeEntryRouter = Router()

TimeEntryRouter.post(
    "/create-entry",
    validator(timeEntryValidator.createTimeEntrySchema),
    TimeEntryController.createTimeEntry
)

TimeEntryRouter.get(
    "/get/:accountId",
    validator(timeEntryValidator.getTimeEntriesSchema),
    TimeEntryController.getAccountEntries
)

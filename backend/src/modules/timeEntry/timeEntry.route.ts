import validator from "@/middleware/validator"
import { Router } from "express"
import { TimeEntryController } from "./timeEntry.controller"
import { TimeEntryValidator } from "./timeEntry.validator"

export const TimeEntryRouter = Router()

TimeEntryRouter.post(
    "/create-entry",
    validator(TimeEntryValidator.createTimeEntrySchema),
    TimeEntryController.createTimeEntry
)

// Get account entries
TimeEntryRouter.get(
    "/get-entry/:account",
    validator(TimeEntryValidator.getTimeEntriesSchema),
    TimeEntryController.getAccountEntries
)
//TODO Inject account from auth middleware
TimeEntryRouter.get(
    "/get-all",
    validator(TimeEntryValidator.getAllEntriesSchema),
    TimeEntryController.getAllEntries
)
TimeEntryRouter.delete(
    "/delete/:id",
    validator(TimeEntryValidator.deleteByIdSchema),
    TimeEntryController.deleteTimeEntry
)

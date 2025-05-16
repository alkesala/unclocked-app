import { Router } from "express"
import { TimeEntryController } from "./timeEntry.controller"
import validator from "@/middleware/validator"
import { TimeEntryValidator } from "./timeEntry.validator"

export const TimeEntryRouter = Router()

TimeEntryRouter.post(
    "/create-entry",
    validator(TimeEntryValidator.createTimeEntrySchema),
    TimeEntryController.createTimeEntry
)

TimeEntryRouter.get(
    "/get-entry/:accountId",
    validator(TimeEntryValidator.getTimeEntriesSchema),
    TimeEntryController.getAccountEntries
)

TimeEntryRouter.get(
    "/get-all",
    validator(TimeEntryValidator.getAllEntriesSchema),
    TimeEntryController.getAllEntries
)

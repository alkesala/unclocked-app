import validator from "@/middleware/validator"
import { Router } from "express"
import { TimeEntryController } from "./timeEntry.controller"
import { TimeEntryValidator } from "./timeEntry.validator"

export const TimeEntryRouter = Router()

TimeEntryRouter.post(
    "/",
    validator(TimeEntryValidator.createTimeEntrySchema),
    TimeEntryController.createTimeEntry
)

TimeEntryRouter.get(
    "/",
    validator(TimeEntryValidator.getAllEntriesSchema),
    TimeEntryController.getEntries
)
TimeEntryRouter.delete(
    "/:id",
    validator(TimeEntryValidator.deleteByIdSchema),
    TimeEntryController.deleteTimeEntry
)

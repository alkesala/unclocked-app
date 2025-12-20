import validator from "@/middleware/validator"
import { Router } from "express"
import { TimeEntryController } from "./timeEntry.controller"
import { TimeEntryValidator } from "@unclocked-app/shared"

export const TimeEntryRouter = Router()

TimeEntryRouter.post(
    "/time-entries",
    validator(TimeEntryValidator.createTimeEntrySchema),
    TimeEntryController.createTimeEntry
)

TimeEntryRouter.get(
    "/time-entries",
    validator(TimeEntryValidator.getAllEntriesSchema),
    TimeEntryController.getEntries
)
TimeEntryRouter.delete(
    "/time-entries/:id",
    validator(TimeEntryValidator.deleteByIdSchema),
    TimeEntryController.deleteTimeEntry
)
TimeEntryRouter.patch(
    "/time-entries/:id",
    validator(TimeEntryValidator.updateTimeEntrySchema),
    TimeEntryController.updateTimeEntryById
)
TimeEntryRouter.patch(
    "/time-entries/end/:id",
    validator(TimeEntryValidator.endTimeEntrySchema),
    TimeEntryController.endTimeEntry
)

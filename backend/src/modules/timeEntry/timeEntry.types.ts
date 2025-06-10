import { z } from "zod"
import { TimeEntryValidator } from "./timeEntry.validator"

export type CreateTimeEntryInput = z.infer<
    typeof TimeEntryValidator.createTimeEntrySchema
>
export type GetTimeEntryParams = z.infer<
    typeof TimeEntryValidator.getTimeEntriesSchema
>

export type GetAllEntryQueries = z.infer<
    typeof TimeEntryValidator.getAllEntriesSchema
>

export type TimeEntry = {
    id: string
    account: string
    startedAt: Date
    endedAt: Date
    project: string
    note?: string
}

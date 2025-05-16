import { z } from "zod"
import { timeEntryValidator } from "./timeEntry.validator"

export type CreateTimeEntryInput = z.infer<
    typeof timeEntryValidator.createTimeEntrySchema
>
export type GetTimeEntryParams = z.infer<
    typeof timeEntryValidator.getTimeEntriesSchema
>

export type GetAllEntryQueries = z.infer<
    typeof timeEntryValidator.getAllEntriesSchema
>

export type TimeEntry = {
    id: string
    accountId: string
    startedAt: Date
    endedAt: Date
    project: string
    course: string
    note?: string
}

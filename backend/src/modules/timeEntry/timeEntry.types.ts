import { z } from "zod"
import { timeEntryValidator } from "./timeEntry.validator"

export type CreateTimeEntryInput = z.infer<
    typeof timeEntryValidator.createTimeEntrySchema
>
export type getTimeEntryParams = z.infer<
    typeof timeEntryValidator.getTimeEntriesSchema
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

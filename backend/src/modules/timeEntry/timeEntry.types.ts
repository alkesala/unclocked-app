import { z } from "zod"
import { createTimeEntrySchema } from "./timeEntry.validator"

export type CreateTimeEntryInput = z.infer<typeof createTimeEntrySchema>

export type TimeEntry = {
    id: string
    accountId: string
    startedAt: Date
    endedAt: Date
    project: string
    course: string
    note?: string
}

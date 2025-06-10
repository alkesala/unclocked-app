import { Types } from "mongoose"
import { z } from "zod"
import {
    TimeEntryFilterSchema,
    TimeEntryValidator,
} from "./timeEntry.validator"
export type CreateTimeEntryInput = z.infer<
    typeof TimeEntryValidator.createTimeEntryBodySchema
>
export type GetTimeEntryParams = z.infer<
    typeof TimeEntryValidator.getTimeEntriesSchema
>

export type GetAllEntryQueries = z.infer<
    typeof TimeEntryValidator.getAllEntriesSchema
>
export type TimeEntryFilter = z.infer<typeof TimeEntryFilterSchema>

export type TimeEntry = {
    id: string
    account: Types.ObjectId
    startedAt: Date
    endedAt: Date
    project: Types.ObjectId
    note?: string
}

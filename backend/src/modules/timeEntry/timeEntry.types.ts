import { Types } from "mongoose"
import { z } from "zod"
import {
    TimeEntryFilterSchema,
    TimeEntryValidator,
} from "./timeEntry.validator"

export type CreateTimeEntryInput = z.infer<
    typeof TimeEntryValidator.createTimeEntrySchema
>

export type TimeEntryFilterWithAccount = z.infer<
    typeof TimeEntryFilterSchema
> & {
    accountId: Types.ObjectId
}

export type TimeEntryFilter = z.infer<typeof TimeEntryFilterSchema>

export type TimeEntry = {
    id: string
    account: Types.ObjectId
    startedAt: Date
    endedAt: Date
    project: Types.ObjectId
    note?: string
}

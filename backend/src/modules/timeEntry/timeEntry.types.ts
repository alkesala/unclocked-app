import { Types } from "mongoose"
import { z } from "zod"
import {
    TimeEntryFilterSchema,
    TimeEntryValidator,
} from "./timeEntry.validator"

export type CreateTimeEntryInput = z.infer<
    typeof TimeEntryValidator.createTimeEntrySchema
>["body"]

export type TimeEntryFilter = z.infer<typeof TimeEntryFilterSchema> & {
    accountId: string
}

export type TimeEntry = {
    id: string
    account: Types.ObjectId
    startedAt: Date
    endedAt: Date
    project: Types.ObjectId
    note?: string
}
export type DeleteTimeEntryInput = {
    id: string
    accountId: string
}

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

export type DeleteTimeEntryInput = {
    id: string
    accountId: string
}

export type EndTimeEntryInput = z.infer<
    typeof TimeEntryValidator.endTimeEntrySchema
>

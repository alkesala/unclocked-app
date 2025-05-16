import { z } from "zod"
import { BaseFilterSchema } from "../../types/request-filters"

// Pagination included
const getAllEntriesSchema = z.object({
    query: BaseFilterSchema.extend({
        accountId: z.string().min(1),
        project: z.string().min(1),
        course: z.string().min(1),
    }),
})

// accountId is just z.string while development cause of hardcoded "user"
// TODO: Change accountId => UUID
const createTimeEntrySchema = z.object({
    body: z.object({
        accountId: z.string().min(1),
        startedAt: z.string().datetime(),
        endedAt: z.string().datetime(),
        project: z.string().min(1),
        course: z.string().min(1),
        note: z.string().optional(),
    }),
})
// TODO: change accountid => UUID // pagination
const getTimeEntriesSchema = z.object({
    params: z.object({
        accountId: z.string().min(1),
    }),
})

export const timeEntryFilterSchema = BaseFilterSchema.extend({
    accountId: z.string().optional(),
    project: z.string().optional(),
    course: z.string().optional(),
})

export type TimeEntryFilter = z.infer<typeof timeEntryFilterSchema>

export const timeEntryValidator = {
    getAllEntriesSchema,
    createTimeEntrySchema,
    getTimeEntriesSchema,
}

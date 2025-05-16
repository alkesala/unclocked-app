import { z } from "zod"

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

const getTimeEntriesSchema = z.object({
    params: z.object({
        accountId: z.string().min(1),
    }),
})

export const timeEntryValidator = {
    createTimeEntrySchema,
    getTimeEntriesSchema,
}

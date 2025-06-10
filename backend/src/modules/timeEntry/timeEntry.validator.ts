import { PaginationQuerySchema } from "@/types/request-filters"
import { dateString, objectId } from "@/utils/zodHelper"
import { z } from "zod"
// Pagination included
const getAllEntriesSchema = z.object({
    query: PaginationQuerySchema.extend({
        project: objectId.optional(),
    }),
})

// Using zodHleper for objectId and dateString for easier consistency
const createTimeEntrySchema = z.object({
    body: z.object({
        startedAt: dateString,
        endedAt: dateString,
        project: objectId,
        note: z.string().optional(),
    }),
})

const deleteByIdSchema = z.object({
    params: z.object({
        id: z.string().length(24),
    }),
})

export const TimeEntryFilterSchema = PaginationQuerySchema.extend({
    project: objectId.optional(),
})

export const TimeEntryValidator = {
    getAllEntriesSchema,
    deleteByIdSchema,
    createTimeEntrySchema,
}

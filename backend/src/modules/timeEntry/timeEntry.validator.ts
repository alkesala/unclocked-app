import { PaginationQuerySchema } from "@/types/request-filters"
import { dateString, objectId } from "@/utils/zodHelper"
import { z } from "zod"
// Pagination included
const getAllEntriesSchema = z.object({
    params: z.object({
        account: objectId,
    }),
    query: PaginationQuerySchema.extend({
        project: objectId.optional(),
    }),
})

// Using zodHleper for objectId and dateString for easier consistency
const createTimeEntryBodySchema = z.object({
    account: objectId,
    startedAt: dateString,
    endedAt: dateString,
    project: objectId,
    note: z.string().optional(),
})
const createTimeEntrySchema = z.object({
    body: createTimeEntryBodySchema,
})

// TODO: change accountid => UUID // pagination
const getTimeEntriesSchema = z.object({
    params: z.object({
        account: z.string().min(1),
    }),
})
const deleteByIdSchema = z.object({
    params: z.object({
        id: z.string().length(24),
    }),
})

export const TimeEntryFilterSchema = PaginationQuerySchema.extend({
    account: objectId.optional(),
    project: objectId.optional(),
})

export const TimeEntryValidator = {
    getAllEntriesSchema,
    deleteByIdSchema,
    createTimeEntrySchema,
    getTimeEntriesSchema,
    createTimeEntryBodySchema,
}

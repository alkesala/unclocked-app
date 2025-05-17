import { z } from "zod"
import { PaginationQuerySchema } from "@/types/request-filters"
import { Types } from "mongoose"
// Pagination included
const getAllEntriesSchema = z.object({
    query: PaginationQuerySchema.extend({
        account: z.string().optional(),
        project: z.string().optional(),
        course: z.string().optional(),
    }),
})

// TODO: implement preprocess / Refactor this shit
const createTimeEntrySchema = z.object({
    body: z.object({
        account: z
            .string()
            .length(24)
            .transform((s) => new Types.ObjectId(s)),
        startedAt: z
            .string()
            .datetime()
            .transform((s) => new Date(s)),
        endedAt: z
            .string()
            .datetime()
            .transform((s) => new Date(s)),
        project: z
            .string()
            .length(24)
            .transform((s) => new Types.ObjectId(s)),
        course: z
            .string()
            .length(24)
            .transform((s) => new Types.ObjectId(s)),
        note: z.string().optional(),
    }),
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
    account: z.string().optional(),
    project: z.string().optional(),
    course: z.string().optional(),
})

export type TimeEntryFilter = z.infer<typeof TimeEntryFilterSchema>

export const TimeEntryValidator = {
    getAllEntriesSchema,
    deleteByIdSchema,
    createTimeEntrySchema,
    getTimeEntriesSchema,
}

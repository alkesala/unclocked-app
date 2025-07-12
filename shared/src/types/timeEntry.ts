import { PaginationQuerySchema } from "@backend/types/request-filters"
import { dateString, objectId } from "@backend/utils/zodHelper"
import { z } from "zod"
// Pagination included
const getAllEntriesSchema = z.object({
  query: PaginationQuerySchema.extend({
    project: objectId.optional(),
  }),
})

const startTimeEntrySchema = z.object({
  body: z.object({
    project: objectId,
    note: z.string().optional(),
    hourlyRate: z.number().optional(),
  }),
})

// Using zodHleper for objectId and dateString for easier consistency
const createTimeEntrySchema = z.object({
  body: z.object({
    startedAt: dateString,
    endedAt: dateString.optional(),
    project: objectId,
    note: z.string().optional(),
    hourlyRate: z.number().optional(),
  }),
})

const deleteByIdSchema = z.object({
  params: z.object({
    id: z.string().length(24),
  }),
})

const endTimeEntrySchema = z.object({
  params: z.object({
    id: z.string().length(24),
  }),
  body: z.object({
    endedAt: dateString,
  }),
})

export const TimeEntryFilterSchema = PaginationQuerySchema.extend({
  project: objectId.optional(),
})

export const TimeEntryValidator = {
  getAllEntriesSchema,
  deleteByIdSchema,
  createTimeEntrySchema,
  endTimeEntrySchema,
  startTimeEntrySchema,
}

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

export type StartTimeEntryInput = z.infer<
  typeof TimeEntryValidator.startTimeEntrySchema
>["body"]

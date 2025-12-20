import { dateString, objectId } from "../utils/zodHelper";
import { PaginationQuerySchema } from "./request-filters";
import { z } from "zod";
// Pagination included
const getAllEntriesSchema = z.object({
  query: PaginationQuerySchema.extend({
    project: objectId.optional(),
  }),
});

// Using zodHleper for objectId and dateString for easier consistency
const createTimeEntrySchema = z.object({
  body: z.object({
    startedAt: dateString,
    endedAt: dateString.optional(),
    project: objectId,
    note: z.string().optional(),
    hourlyRate: z.number().optional(),
  }),
});

const deleteByIdSchema = z.object({
  params: z.object({
    id: z.string().length(24),
  }),
});

const endTimeEntrySchema = z.object({
  params: z.object({
    id: z.string().length(24),
  }),
  body: z.object({
    endedAt: dateString,
  }),
});

const updateTimeEntrySchema = z.object({
  params: z.object({
    id: z.string().length(24),
  }),
  body: z.object({
    startedAt: dateString.optional(),
    endedAt: dateString.optional(),
    project: objectId.optional(),
    note: z.string().optional(),
    hourlyRate: z.number().optional(),
  }),
});

export const TimeEntryFilterSchema = PaginationQuerySchema.extend({
  project: objectId.optional(),
});

export const TimeEntryValidator = {
  getAllEntriesSchema,
  deleteByIdSchema,
  createTimeEntrySchema,
  endTimeEntrySchema,
  updateTimeEntrySchema,
};

// Type after Zod preprocessing (used by backend)
export type CreateTimeEntryInput = z.infer<
  typeof TimeEntryValidator.createTimeEntrySchema
>["body"];

// Type before Zod preprocessing (raw JSON payload from frontend)
export type CreateTimeEntryPayload = {
  project: string;
  startedAt: string;
  endedAt?: string;
  note?: string;
  hourlyRate?: number;
};

export type TimeEntryFilter = z.infer<typeof TimeEntryFilterSchema> & {
  accountId: string;
};

export type DeleteTimeEntryInput = {
  id: string;
  accountId: string;
};

export type EndTimeEntryInput = z.infer<
  typeof TimeEntryValidator.endTimeEntrySchema
>;

// Type after Zod preprocessing (used by backend)
export type UpdateTimeEntryInput = z.infer<
  typeof TimeEntryValidator.updateTimeEntrySchema
>["body"];

// Type before Zod preprocessing (raw JSON payload from frontend)
export type UpdateTimeEntryPayload = {
  project?: string;
  startedAt?: string;
  endedAt?: string;
  note?: string;
  hourlyRate?: number;
};

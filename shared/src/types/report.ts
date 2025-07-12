import { PaginationQuerySchema } from "@backend/types/request-filters"
import { dateString, objectId } from "@backend/utils/zodHelper"
import { Types } from "mongoose"
import { z } from "zod"
// Do not add totalHours or totalEarnings, they are computed in the backend and user cannot set them
const createReportSchema = z.object({
  body: z.object({
    project: objectId,
    rangeStart: dateString,
    rangeEnd: dateString,
    name: z.string().min(1),
  }),
})

const getReportsSchema = z.object({
  query: PaginationQuerySchema.extend({
    project: objectId.optional(),
  }),
})

const deleteReportByIdSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Report ID is required"),
  }),
})

export const ReportFilterSchema = PaginationQuerySchema.extend({
  project: objectId.optional(),
})

export const ReportsValidator = {
  createReportSchema,
  getReportsSchema,
  deleteReportByIdSchema,
}

export type CreateReportInput = z.infer<
  typeof ReportsValidator.createReportSchema
>

export type ReportFilter = z.infer<typeof ReportFilterSchema> & {
  accountId: string
}

export interface ReportEntry {
  account: Types.ObjectId
  project: Types.ObjectId
  rangeStart: Date
  rangeEnd: Date
  name: string
}

export interface DeleteReportInput {
  id: string
  accountId: string
}

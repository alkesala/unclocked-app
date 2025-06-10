import { PaginationQuerySchema } from "@/types/request-filters"
import { dateString, objectId } from "@/utils/zodHelper"
import { z } from "zod"

// Schema for creating a report
// Do not add totalHours or totalEarnings, they are computed in the backend and user cannot set them
const getAllReportsSchema = z.object({
    params: z.object({
        account: objectId,
    }),
    query: PaginationQuerySchema.extend({
        project: objectId.optional(),
    }),
})

const createReportBodySchema = z.object({
    account: objectId,
    project: objectId,
    rangeStart: dateString,
    rangeEnd: dateString,
    name: z.string().min(1),
})

const createReportSchema = z.object({
    body: createReportBodySchema,
})

export const ReportFilterSchema = PaginationQuerySchema.extend({
    account: objectId.optional(),
    project: objectId.optional(),
})

export const ReportsValidator = {
    createReportSchema,
    createReportBodySchema,
    getAllReportsSchema,
}

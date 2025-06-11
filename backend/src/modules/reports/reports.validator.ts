import { PaginationQuerySchema } from "@/types/request-filters"
import { dateString, objectId } from "@/utils/zodHelper"
import { z } from "zod"

// Do not add totalHours or totalEarnings, they are computed in the backend and user cannot set them
const createReportSchema = z.object({
    body: z.object({
        account: objectId,
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

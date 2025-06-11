import { Types } from "mongoose"
import { z } from "zod"
import { ReportFilterSchema, ReportsValidator } from "./reports.validator"

export type CreateReportInput = z.infer<
    typeof ReportsValidator.createReportSchema
>

export type ReportFilter = z.infer<typeof ReportFilterSchema> & {
    accountId: Types.ObjectId
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

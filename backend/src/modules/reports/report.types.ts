import { Types } from "mongoose"
import { z } from "zod"
import { ReportsValidator } from "./reports.validator"

export type CreateReportInput = z.infer<
    typeof ReportsValidator.createReportBodySchema
>

export type GetReportParams = z.infer<
    typeof ReportsValidator.getAllReportsSchema
>

export type ReportEntry = {
    account: Types.ObjectId
    project: Types.ObjectId
    rangeStart: Date
    rangeEnd: Date
    name: string
}

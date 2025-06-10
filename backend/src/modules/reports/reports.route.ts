import validator from "@/middleware/validator"
import { Router } from "express"
import { ReportController } from "./reports.controller"
import { ReportsValidator } from "./reports.validator"

export const ReportRouter = Router()

ReportRouter.get(
    "/",
    validator(ReportsValidator.getAllReportsSchema),
    ReportController.getAllReports
)

ReportRouter.post(
    "/",
    validator(ReportsValidator.createReportSchema),
    ReportController.createReport
)

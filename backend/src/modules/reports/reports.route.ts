import validator from "@/middleware/validator"
import { Router } from "express"
import { ReportController } from "./reports.controller"
import { ReportsValidator } from "./reports.validator"

export const ReportRouter = Router()

ReportRouter.get(
    "/get-all",
    validator(ReportsValidator.getAllReportsSchema),
    ReportController.getAllReports
)

ReportRouter.post(
    "/create-report",
    validator(ReportsValidator.createReportSchema),
    ReportController.createReport
)

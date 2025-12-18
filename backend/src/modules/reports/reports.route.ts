import validator from "@/middleware/validator"
import { Router } from "express"
import { ReportController } from "./reports.controller"
import { ReportsValidator } from "@unclocked-app/shared"

export const ReportRouter = Router()

/** Get all reports, /w pagination and filtering
 * * @route GET /api/v1/reports/
 * * @queryParam project - filter by project ID
 * * @accountId - the account ID of the user making the request injected by the auth middleware
 */
ReportRouter.get(
    "/",
    validator(ReportsValidator.getReportsSchema),
    ReportController.getReports
)

/** Post a new report
 * * @route POST /api/v1/reports/
 * * @bodyParam boddy - the report body containing account, project, rangeStart, rangeEnd, and name
 * * @accountId - the account ID of the user making the request injected by the auth middleware
 */
ReportRouter.post(
    "/",
    validator(ReportsValidator.createReportSchema),
    ReportController.createReport
)

/** Delete a report by ID
 * * @route DELETE /api/v1/reports/:id
 * * @param id - the ID of the report to delete
 */
ReportRouter.delete(
    "/:id",
    validator(ReportsValidator.deleteReportByIdSchema),
    ReportController.deleteReportById
)

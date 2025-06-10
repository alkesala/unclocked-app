import { NextFunction, Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { GetReportParams } from "./report.types"
import { ReportService } from "./reports.service"
import { ReportFilterSchema } from "./reports.validator"

const createReport = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const created = await ReportService.createReport(req.body)
        res.status(StatusCodes.CREATED).json(created)
    } catch (err) {
        next(err)
    }
}

const getAccountReports = async (
    req: Request<GetReportParams["params"]>,
    res: Response,
    next: NextFunction
) => {
    try {
        const filter = ReportFilterSchema.parse({
            ...req.query,
            account: req.params.account,
        })
        const result = await ReportService.getAllReports(filter)
        res.status(StatusCodes.OK).json(result)
    } catch (err) {
        next(err)
    }
}

const deleteReportById = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
) => {
    const { id } = req.params
    try {
        const deleted = await ReportService.deleteReportById(id)
        if (!deleted) {
            res.status(StatusCodes.NOT_FOUND).json({
                error: "Report not found",
            })
        } else {
            res.status(StatusCodes.OK).json({ success: true, id })
        }
    } catch (err) {
        next(err)
    }
}

export const ReportController = {
    createReport,
    getAccountReports,
    deleteReportById,
}

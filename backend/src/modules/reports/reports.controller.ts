import { NextFunction, Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { Types } from "mongoose"
import { ReportService } from "./reports.service"
import { ReportFilterSchema } from "./reports.validator"

const createReport = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.accountId) throw new Error("Unauthorized")
        const created = await ReportService.createReport({
            ...req.body,
            account: req.accountId,
        })
        res.status(StatusCodes.CREATED).json(created)
    } catch (err) {
        next(err)
    }
}

const getReports = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.accountId) throw new Error("Unauthorized")
        const filter = ReportFilterSchema.parse(req.query)
        const result = await ReportService.getReports({
            ...filter,
            accountId: new Types.ObjectId(req.accountId),
        })
        res.status(StatusCodes.OK).json(result)
    } catch (err) {
        next(err)
    }
}

const deleteReportById = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const { id } = req.params
    try {
        if (!req.accountId) {
            res.status(StatusCodes.UNAUTHORIZED).json({
                error: "Unauthorized",
            })
            return
        }
        const deleted = await ReportService.deleteReportById({
            id,
            accountId: req.accountId,
        })
        if (!deleted) {
            res.status(StatusCodes.NOT_FOUND).json({
                error: "Report not found",
            })
            return
        }
        res.status(StatusCodes.OK).json({ success: true, id })
    } catch (err) {
        next(err)
    }
}

export const ReportController = {
    createReport,
    deleteReportById,
    getReports,
}

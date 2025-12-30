import { Types } from "mongoose"
import {
    CreateReportInput,
    DeleteReportInput,
    ReportFilter,
} from "@unclocked-app/shared"
import { ReportModel } from "./reports.model"
import { TimeEntryService } from "../timeEntry/timeEntry.service"

// Basic CRUD operations for reports
const createReport = async (input: CreateReportInput) => {
    const { project, rangeStart, rangeEnd, name, account } = input

    // Calculate totals from time entries
    const { totalHours, totalEarnings } =
        await TimeEntryService.calculateTotalsForReport(
            project.toString(),
            rangeStart,
            rangeEnd,
            account.toString()
        )

    // Create report with calculated values
    return ReportModel.create({
        account,
        project,
        name,
        rangeStart,
        rangeEnd,
        totalHours,
        totalEarnings,
    })
}

const getReports = async (filter: ReportFilter) => {
    const { page = 1, limit = 20, accountId, ...queryFilters } = filter
    const accountObjectId = new Types.ObjectId(accountId)
    const offset = (page - 1) * limit
    const [data, total] = await Promise.all([
        ReportModel.find({ account: accountObjectId, ...queryFilters })
            .skip(offset)
            .limit(limit),
        ReportModel.countDocuments({
            account: accountObjectId,
            ...queryFilters,
        }),
    ])

    return {
        data,
        total,
        page,
        limit,
        offset,
    }
}

const deleteReportById = async (input: DeleteReportInput) => {
    const { id, accountId } = input
    const accountObjectId = new Types.ObjectId(accountId)
    return ReportModel.findOneAndDelete({
        _id: id,
        account: accountObjectId,
    }).exec()
}

export const ReportService = {
    createReport,
    getReports,
    deleteReportById,
}

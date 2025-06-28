import { Types } from "mongoose"
import {
    CreateReportInput,
    DeleteReportInput,
    ReportFilter,
} from "@shared/types/report"
import { ReportModel } from "./reports.model"

// Basic CRUD operations for reports
const createReport = async (input: CreateReportInput) => {
    return ReportModel.create(input)
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

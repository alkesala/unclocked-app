import { CreateReportInput, ReportFilter } from "./report.types"
import { ReportModel } from "./reports.model"

// Basic CRUD operations for reports
const createReport = async (input: CreateReportInput) => {
    return ReportModel.create(input)
}

const getAllReports = async (filter: ReportFilter) => {
    const { page = 1, limit = 20, accountId, ...queryFilters } = filter
    const offset = (page - 1) * limit
    const [data, total] = await Promise.all([
        ReportModel.find({ account: accountId, ...queryFilters })
            .skip(offset)
            .limit(limit),
        ReportModel.countDocuments({ account: accountId, ...queryFilters }),
    ])
    return {
        data,
        total,
        page,
        limit,
        offset,
    }
}

const deleteReportById = async (id: string) => {
    return ReportModel.findByIdAndDelete(id).exec()
}

export const ReportService = {
    createReport,
    getAllReports,
    deleteReportById,
}

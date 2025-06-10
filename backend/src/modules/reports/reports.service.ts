import { PaginationFilter } from "@/types/request-filters"
import { CreateReportInput } from "./report.types"
import { ReportModel } from "./reports.model"

const createReport = async (input: CreateReportInput) => {
    return ReportModel.create(input)
}

const getAllReports = async (filter: PaginationFilter) => {
    const { page = 1, limit = 20, ...queryFilters } = filter
    const offset = (page - 1) * limit
    const [data, total] = await Promise.all([
        ReportModel.find(queryFilters).skip(offset).limit(limit),
        ReportModel.countDocuments(queryFilters),
    ])
    return {
        data,
        total,
        page,
        limit,
        offset,
    }
}

export const ReportService = {
    createReport,
    getAllReports,
}

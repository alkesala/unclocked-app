import { BaseFilter } from "src/types/request-filters"
import { TimeEntryModel } from "./timeEntry.model"
import { CreateTimeEntryInput } from "./timeEntry.types"

const create = async (input: CreateTimeEntryInput) => {
    return TimeEntryModel.create(input)
}

// Only for ADMIN
const getAllEntries = async (filter: BaseFilter) => {
    const { page = 1, limit = 20, ...queryFilters } = filter
    const offset = (page - 1) * limit
    const [data, total] = await Promise.all([
        TimeEntryModel.find(queryFilters).skip(offset).limit(limit),
        TimeEntryModel.countDocuments(queryFilters),
    ])
    return {
        data,
        total,
        page,
        limit,
        offset,
    }
}

const getByAccount = async (accountId: string) => {
    return TimeEntryModel.find({ accountId }).sort({ startedAt: -1 }).lean()
}

export const TimeEntryService = {
    create,
    getAllEntries,
    getByAccount,
}

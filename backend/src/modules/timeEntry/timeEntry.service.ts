import { PaginationFilter } from "@/types/request-filters"
import { TimeEntryModel } from "./timeEntry.model"
import { CreateTimeEntryInput } from "./timeEntry.types"

const create = async (input: CreateTimeEntryInput) => {
    return TimeEntryModel.create(input)
}

const deleteById = async (id: string) => {
    return TimeEntryModel.findByIdAndDelete(id).exec()
}

const getAllEntries = async (filter: PaginationFilter) => {
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

export const TimeEntryService = {
    create,
    deleteById,
    getAllEntries,
}

import { TimeEntryModel } from "./timeEntry.model"
import {
    CreateTimeEntryInput,
    TimeEntryFilterWithAccount,
} from "./timeEntry.types"

const create = async (input: CreateTimeEntryInput) => {
    return TimeEntryModel.create(input)
}

const deleteById = async (id: string) => {
    return TimeEntryModel.findByIdAndDelete(id).exec()
}

const getAllEntries = async (filter: TimeEntryFilterWithAccount) => {
    const { accountId, page = 1, limit = 20, ...queryFilters } = filter
    const offset = (page - 1) * limit
    const [data, total] = await Promise.all([
        TimeEntryModel.find({ account: accountId, ...queryFilters })
            .skip(offset)
            .limit(limit),
        TimeEntryModel.countDocuments({ account: accountId, ...queryFilters }),
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

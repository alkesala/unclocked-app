import { Types } from "mongoose"
import { TimeEntryModel } from "./timeEntry.model"
import {
    CreateTimeEntryInput,
    DeleteTimeEntryInput,
    TimeEntryFilterWithAccount,
} from "./timeEntry.types"

const create = async (input: CreateTimeEntryInput) => {
    return TimeEntryModel.create(input)
}

const deleteById = async (input: DeleteTimeEntryInput) => {
    const { id, accountId } = input
    const accoundObjectId = new Types.ObjectId(accountId)
    return TimeEntryModel.findOneAndDelete({
        _id: id,
        account: accoundObjectId,
    }).exec()
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

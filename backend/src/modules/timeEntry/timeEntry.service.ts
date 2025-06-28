import { Types } from "mongoose"
import { ProjectModel } from "../project/project.model"
import { TimeEntryModel } from "./timeEntry.model"
import {
    CreateTimeEntryInput,
    DeleteTimeEntryInput,
    EndTimeEntryInput,
    TimeEntryFilter,
} from "@shared/types/timeEntry"
const create = async (input: CreateTimeEntryInput) => {
    const project = await ProjectModel.findById(input.project)

    if (!project) {
        throw new Error("Project not found")
    }

    const effectiveHourlyRate = input.hourlyRate ?? project.hourlyRate ?? 0

    return TimeEntryModel.create({
        ...input,
        hourlyRate: effectiveHourlyRate,
    })
}

const endTimeEntry = async (input: EndTimeEntryInput, accountId: string) => {
    const accountObjectId = new Types.ObjectId(accountId)
    return TimeEntryModel.findOneAndUpdate(
        { _id: input.params.id, account: accountObjectId },
        { $set: { endedAt: input.body.endedAt } },
        { new: true }
    )
}

const getAllEntries = async (filter: TimeEntryFilter) => {
    const { page = 1, limit = 20, accountId, ...queryFilters } = filter
    const accountObjectId = new Types.ObjectId(accountId)
    const offset = (page - 1) * limit
    const [data, total] = await Promise.all([
        TimeEntryModel.find({ account: accountObjectId, ...queryFilters })
            .skip(offset)
            .limit(limit),
        TimeEntryModel.countDocuments({
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
const deleteById = async (input: DeleteTimeEntryInput) => {
    const { id, accountId } = input
    const accountObjectId = new Types.ObjectId(accountId)
    return TimeEntryModel.findOneAndDelete({
        _id: id,
        account: accountObjectId,
    }).exec()
}

export const TimeEntryService = {
    create,
    deleteById,
    getAllEntries,
    endTimeEntry,
}

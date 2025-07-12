import {
    CreateTimeEntryInput,
    DeleteTimeEntryInput,
    EndTimeEntryInput,
    StartTimeEntryInput,
    TimeEntryFilter,
} from "@shared/types/timeEntry"
import { Types } from "mongoose"
import { ProjectModel } from "../project/project.model"
import { TimeEntryModel } from "./timeEntry.model"
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

const startTimeEntry = async (
    input: StartTimeEntryInput,
    accountId: string
) => {
    const existingActiveTimeEntry = await TimeEntryModel.findOne({
        account: new Types.ObjectId(accountId),
        endedAt: { $exists: false },
    })

    if (existingActiveTimeEntry) {
        throw new Error("You have an active time entry")
    }
    const project = await ProjectModel.findById(input.project)
    if (!project) {
        throw new Error("Project not found")
    }

    const timer = await TimeEntryModel.create({
        startedAt: new Date(),
        account: new Types.ObjectId(accountId),
        project: new Types.ObjectId(input.project),
        note: input.note,
        hourlyRate: project.hourlyRate ?? 0,
    })
    return timer
}

const endTimeEntry = async (input: EndTimeEntryInput, accountId: string) => {
    const accountObjectId = new Types.ObjectId(accountId)
    const existingTimeEntry = await TimeEntryModel.findOne({
        _id: input.params.id,
        account: accountObjectId,
    })

    if (!existingTimeEntry) {
        throw new Error("Time entry not found")
    }
    const duration = Math.round(
        (new Date(input.body.endedAt).getTime() -
            new Date(existingTimeEntry.startedAt).getTime()) /
            (1000 * 60 * 60)
    )
    return TimeEntryModel.findOneAndUpdate(
        { _id: input.params.id, account: accountObjectId },
        { $set: { endedAt: input.body.endedAt, duration: duration } },
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

const getActiveTimer = async (accountId: string) => {
    const accountObjectId = new Types.ObjectId(accountId)

    const activeTimer = await TimeEntryModel.findOne({
        account: accountObjectId,
        endedAt: { $exists: false },
    })

    if (!activeTimer) {
        return null
    }

    // Calculate current duration for active timer
    const currentDuration =
        (Date.now() - activeTimer.startedAt.getTime()) / (1000 * 60 * 60)

    return {
        ...activeTimer.toJSON(),
        currentDuration: Math.round(currentDuration * 100) / 100,
    }
}

export const TimeEntryService = {
    create,
    deleteById,
    getAllEntries,
    endTimeEntry,
    startTimeEntry,
    getActiveTimer,
}

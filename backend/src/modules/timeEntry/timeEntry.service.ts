import { Types } from "mongoose"
import { ProjectModel } from "../project/project.model"
import { TimeEntryModel } from "./timeEntry.model"
import {
    CreateTimeEntryInput,
    DeleteTimeEntryInput,
    EndTimeEntryInput,
    TimeEntryFilter,
    UpdateTimeEntryInput,
} from "@unclocked-app/shared"
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

const updateTimeEntryById = async (
    id: string,
    input: Partial<UpdateTimeEntryInput>,
    accountId: string
) => {
    const accountObjectId = new Types.ObjectId(accountId)

    // If project is being updated, verify it exists
    if (input.project) {
        const project = await ProjectModel.findById(input.project)
        if (!project) {
            throw new Error("Project not found")
        }
        // Update hourlyRate if not explicitly provided
        if (input.hourlyRate === undefined) {
            input.hourlyRate = project.hourlyRate
        }
    }

    return TimeEntryModel.findOneAndUpdate(
        { _id: id, account: accountObjectId },
        input,
        { new: true }
    )
}

const calculateTotalsForReport = async (
    projectId: string,
    rangeStart: Date,
    rangeEnd: Date,
    accountId: string
): Promise<{ totalHours: number; totalEarnings: number }> => {
    const accountObjectId = new Types.ObjectId(accountId)
    const projectObjectId = new Types.ObjectId(projectId)

    // Fetch project to get hourly rate fallback
    const project = await ProjectModel.findById(projectObjectId)
    if (!project) {
        throw new Error("Project not found")
    }

    // Query time entries within date range
    const timeEntries = await TimeEntryModel.find({
        account: accountObjectId,
        project: projectObjectId,
        startedAt: { $gte: rangeStart, $lte: rangeEnd },
        endedAt: { $exists: true, $ne: null }, // Only completed entries
    })

    let totalHours = 0
    let totalEarnings = 0

    for (const entry of timeEntries) {
        // Calculate duration in hours
        const durationMs =
            entry.endedAt!.getTime() - entry.startedAt.getTime()
        const durationHours = durationMs / (1000 * 60 * 60)

        // Use entry hourly rate or fallback to project rate
        const rate = entry.hourlyRate ?? project.hourlyRate ?? 0

        totalHours += durationHours
        // Store earnings in cents (multiply by 100)
        totalEarnings += durationHours * rate * 100
    }

    // Round earnings to nearest cent
    totalEarnings = Math.round(totalEarnings)

    return { totalHours, totalEarnings }
}

export const TimeEntryService = {
    create,
    deleteById,
    getAllEntries,
    endTimeEntry,
    updateTimeEntryById,
    calculateTotalsForReport,
}

import { ReportModel } from "@/modules/reports/reports.model"
import { TimeEntryModel } from "@/modules/timeEntry/timeEntry.model"
import {
    CreateProjectInput,
    DeleteProjectInput,
    ProjectsFilter,
    UpdateProjectInput,
} from "@shared/types/project"
import { Types } from "mongoose"
import { ProjectModel } from "./project.model"

const createProject = async (input: CreateProjectInput) => {
    return ProjectModel.create(input)
}

const getProjects = async (filter: ProjectsFilter) => {
    const { page = 1, limit = 20, accountId, ...queryFilters } = filter
    const offset = (page - 1) * limit
    const accountObjectId = new Types.ObjectId(accountId)
    const [data, total] = await Promise.all([
        ProjectModel.find({ account: accountObjectId, ...queryFilters })
            .skip(offset)
            .limit(limit),
        ProjectModel.countDocuments({
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

const updateProjectById = async (
    id: string,
    input: Partial<UpdateProjectInput>,
    accountId: string
) => {
    const accountObjectId = new Types.ObjectId(accountId)
    return ProjectModel.findOneAndUpdate(
        { _id: id, account: accountObjectId },
        input,
        { new: true }
    )
}

const deleteProjectById = async (input: DeleteProjectInput) => {
    const { id, accountId } = input
    const accountObjectId = new Types.ObjectId(accountId)
    const projectObjectId = new Types.ObjectId(id)

    // Check for related time entries
    const timeEntryCount = await TimeEntryModel.countDocuments({
        project: projectObjectId,
        account: accountObjectId,
    })

    // Check for related reports
    const reportCount = await ReportModel.countDocuments({
        project: projectObjectId,
        account: accountObjectId,
    })

    if (timeEntryCount > 0 || reportCount > 0) {
        throw new Error(
            `Cannot delete project. It has ${timeEntryCount} time entries and ${reportCount} reports. ` +
                `Delete all related records first, or delete the entire account to remove all data.`
        )
    }

    return ProjectModel.findOneAndDelete({
        _id: projectObjectId,
        account: accountObjectId,
    }).exec()
}

export const ProjectService = {
    createProject,
    getProjects,
    deleteProjectById,
    updateProjectById,
}

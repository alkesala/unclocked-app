import { Types } from "mongoose"
import { ProjectModel } from "./project.model"
import {
    CreateProjectInput,
    DeleteProjectInput,
    ProjectsFilter,
} from "./project.types"

const createProject = async (input: CreateProjectInput) => {
    return ProjectModel.create(input)
}

const getProjects = async (filter: ProjectsFilter) => {
    const { page = 1, limit = 20, accountId, ...queryFilters } = filter
    const offset = (page - 1) * limit
    const [data, total] = await Promise.all([
        ProjectModel.find({ account: accountId, ...queryFilters })
            .skip(offset)
            .limit(limit),
        ProjectModel.countDocuments({ account: accountId, ...queryFilters }),
    ])
    return {
        data,
        total,
        page,
        limit,
        offset,
    }
}

const deleteProjectById = async (input: DeleteProjectInput) => {
    const { id, accountId } = input
    const accountObjectId = new Types.ObjectId(accountId)
    return ProjectModel.findOneAndDelete({
        _id: id,
        account: accountObjectId,
    }).exec()
}

export const ProjectService = {
    createProject,
    getProjects,
    deleteProjectById,
}

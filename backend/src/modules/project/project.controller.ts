import { NextFunction, Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { Types } from "mongoose"
import { ProjectService } from "./project.service"
import { ProjectFilterSchema } from "./project.validator"

const createProject = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.accountId) {
            res.status(StatusCodes.UNAUTHORIZED).json({
                error: "Unauthorized",
            })
            return
        }
        const created = await ProjectService.createProject({
            ...req.body,
            account: req.accountId,
        })
        res.status(StatusCodes.CREATED).json(created)
    } catch (err) {
        next(err)
    }
}

const getProjects = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.accountId) {
            res.status(StatusCodes.UNAUTHORIZED).json({
                error: "Unauthorized",
            })
            return
        }
        const filter = ProjectFilterSchema.parse(req.query)
        const result = await ProjectService.getProjects({
            ...filter,
            accountId: new Types.ObjectId(req.accountId),
        })
        res.status(StatusCodes.OK).json(result)
    } catch (err) {
        next(err)
    }
}

const updateProjectById = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const { id } = req.params
    try {
        if (!req.accountId) {
            res.status(StatusCodes.UNAUTHORIZED).json({
                error: "Unauthorized",
            })
            return
        }
        const updated = await ProjectService.updateProjectById(id, req.body)
        if (!updated) {
            res.status(StatusCodes.NOT_FOUND).json({
                error: "Project not found",
            })
            return
        }
        res.status(StatusCodes.OK).json(updated)
    } catch (err) {
        next(err)
    }
}
const deleteProjectById = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const { id } = req.params
    try {
        if (!req.accountId) {
            res.status(StatusCodes.UNAUTHORIZED).json({
                error: "Unauthorized",
            })
            return
        }
        const deleted = await ProjectService.deleteProjectById({
            id,
            accountId: req.accountId,
        })
        if (!deleted) {
            res.status(StatusCodes.NOT_FOUND).json({
                error: "Project not found",
            })
            return
        }
        res.status(StatusCodes.NO_CONTENT).send()
    } catch (err) {
        next(err)
    }
}

export const ProjectController = {
    createProject,
    getProjects,
    updateProjectById,
    deleteProjectById,
}

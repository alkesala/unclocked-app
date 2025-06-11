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
        if (!req.accountId) throw new Error("Unauthorized")
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
        if (!req.accountId) throw new Error("Unauthorized")
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

export const ProjectController = {
    createProject,
    getProjects,
}

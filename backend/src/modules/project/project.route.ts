import validator from "@/middleware/validator"
import { Router } from "express"
import { ProjectController } from "./project.controller"
import { ProjectValidator } from "@unclocked-app/shared"

export const ProjectRouter = Router()

/** Get all projects, /w pagination and filtering
 * * @route GET /api/v1/projects/
 * * @queryParam name - filter by project name
 * * @queryParam accountId - filter by account ID
 * * @accountId - the account ID of the user making the request injected by the auth middleware
 */
ProjectRouter.get(
  "/",
  validator(ProjectValidator.getProjectsSchema),
  ProjectController.getProjects
)

/** Post a new project
 * * @route POST /api/v1/projects/
 * * @bodyParam name - the name of the project
 * * @bodyParam description - the description of the project
 * * @accountId - the account ID of the user making the request injected by the auth middleware
 */
ProjectRouter.post(
  "/",
  validator(ProjectValidator.createProjectSchema),
  ProjectController.createProject
)

/** Update a project by ID
 * * @route PATCH /api/v1/projects/:id
 * * @param id - the ID of the project to update
 * * @bodyParam name - the name of the project
 * * @bodyParam description - the description of the project
 * * @bodyParam hourlyRate - the hourly rate of the project
 * * @bodyParam isActive - the active status of the project
 * * @accountId - the account ID of the user making the request injected by the auth middleware
 */
ProjectRouter.put(
  "/:id",
  validator(ProjectValidator.updateProjectSchema),
  ProjectController.updateProjectById
)

/** Delete a project by ID
 * * @route DELETE /api/v1/projects/:id
 * * @param id - the ID of the project to delete
 * * @accountId - the account ID of the user making the request injected by the auth middleware
 */
ProjectRouter.delete(
  "/:id",
  validator(ProjectValidator.deleteProjectByIdSchema),
  ProjectController.deleteProjectById
)

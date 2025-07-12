import validator from "@/middleware/validator"
import { Router } from "express"
import { ProjectController } from "./project.controller"
import { ProjectValidator } from "@shared/types/project"

export const ProjectRouter = Router()

/**
 * @swagger
 * /project:
 *   get:
 *     summary: Get all projects
 *     description: Retrieve a paginated list of projects with optional filtering
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/page'
 *       - $ref: '#/components/parameters/limit'
 *       - $ref: '#/components/parameters/sortby'
 *       - $ref: '#/components/parameters/orderby'
 *       - $ref: '#/components/parameters/isActive'
 *     responses:
 *       200:
 *         description: List of projects
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Project'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
ProjectRouter.get(
    "/",
    validator(ProjectValidator.getProjectsSchema),
    ProjectController.getProjects
)

/**
 * @swagger
 * /project:
 *   post:
 *     summary: Create a new project
 *     description: Create a new project with the provided details
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProjectRequest'
 *     responses:
 *       201:
 *         description: Project created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Project'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
ProjectRouter.post(
    "/",
    validator(ProjectValidator.createProjectSchema),
    ProjectController.createProject
)
/** Delete a project by ID
 * * @route DELETE /api/v1/projects/:id
 * * @param id - the ID of the project to delete
 * * @accountId - the account ID of the user making the request injected by the auth middleware
 */

// ProjectRouter.delete(
//     "/:id",
//     validator(ProjectValidator.deleteProjectByIdSchema),
//     ProjectController.deleteProjectById
// )

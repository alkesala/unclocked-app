import { PaginationQuerySchema } from "@/types/request-filters"
import { objectId } from "@/utils/zodHelper"
import { z } from "zod"

const createProjectSchema = z.object({
    body: z.object({
        account: objectId,
        name: z.string().min(1, "Project name is required"),
        description: z.string().min(1, "Project description is required"),
        isActive: z.boolean().default(true),
    }),
})

const updateProjectSchema = z
    .object({
        body: z.object({
            name: z.string().min(1, "Project name is required").optional(),
            description: z
                .string()
                .min(1, "Project description is required")
                .optional(),
            isActive: z.boolean().optional(),
        }),
    })
    .strict()

export const ProjectFilterSchema = PaginationQuerySchema.extend({
    isActive: z.enum(["true", "false"]).optional(),
})

const getProjectsSchema = z.object({
    query: ProjectFilterSchema,
})

const deleteProjectByIdSchema = z.object({
    params: z.object({
        id: z.string().min(1, "Project ID is required"),
    }),
})

export const ProjectValidator = {
    createProjectSchema,
    getProjectsSchema,
    deleteProjectByIdSchema,
    updateProjectSchema,
}

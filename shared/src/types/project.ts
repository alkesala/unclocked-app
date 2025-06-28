import { PaginationQuerySchema } from "../../../backend/src/types/request-filters";
import { z } from "zod";
const createProjectSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Project name is required"),
    description: z.string().min(1, "Project description is required"),
    isActive: z.boolean().default(true),
    hourlyRate: z.number().optional(),
  }),
});

const updateProjectSchema = z
  .object({
    body: z.object({
      name: z.string().min(1, "Project name is required").optional(),
      description: z
        .string()
        .min(1, "Project description is required")
        .optional(),
      isActive: z.boolean().optional(),
      hourlyRate: z.number().optional(),
    }),
  })
  .strict();

export const ProjectFilterSchema = PaginationQuerySchema.extend({
  isActive: z.enum(["true", "false"]).optional(),
});

const getProjectsSchema = z.object({
  query: ProjectFilterSchema,
});

const deleteProjectByIdSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Project ID is required"),
  }),
});

export type CreateProjectInput = z.infer<
  typeof ProjectValidator.createProjectSchema
>;
export type UpdateProjectInput = z.infer<
  typeof ProjectValidator.updateProjectSchema
>;

export type ProjectsFilter = z.infer<typeof PaginationQuerySchema> & {
  accountId: string;
};

export interface DeleteProjectInput {
  id: string;
  accountId: string;
}

export const ProjectValidator = {
  createProjectSchema,
  getProjectsSchema,
  deleteProjectByIdSchema,
  updateProjectSchema,
};

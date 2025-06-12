import { PaginationQuerySchema } from "@/types/request-filters"
import { Types } from "mongoose"
import { z } from "zod"
import { ProjectValidator } from "./project.validator"

export type CreateProjectInput = z.infer<
    typeof ProjectValidator.createProjectSchema
>
export type UpdateProjectInput = z.infer<
    typeof ProjectValidator.updateProjectSchema
>

export type ProjectsFilter = z.infer<typeof PaginationQuerySchema> & {
    accountId: Types.ObjectId
}

export interface DeleteProjectInput {
    id: string
    accountId: string
}

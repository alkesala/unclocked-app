import { z } from "zod"

export const PaginationQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(20),
    sortby: z.string().optional(),
    orderby: z.enum(["asc", "desc"]).optional(),
})

export type PaginationFilter = z.infer<typeof PaginationQuerySchema>

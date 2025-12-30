import { createFileRoute } from "@tanstack/react-router"
import { ProjectEntriesPage } from "../../pages/ProjectEntriesPage"

export const Route = createFileRoute("/projects/$projectId/entries")({
    component: ProjectEntriesPage,
})

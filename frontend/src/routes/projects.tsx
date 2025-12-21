import { createFileRoute, redirect } from "@tanstack/react-router"
import { ProjectsPage } from "../pages/ProjectsPage"

export const Route = createFileRoute("/projects")({
    beforeLoad: () => {
        const token = localStorage.getItem("auth_token")
        if (!token) {
            throw redirect({ to: "/login" })
        }
    },
    component: ProjectsPage,
})

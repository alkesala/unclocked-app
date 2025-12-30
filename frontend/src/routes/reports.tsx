import { createFileRoute, redirect } from "@tanstack/react-router"
import { ReportsPage } from "../pages/ReportsPage"

export const Route = createFileRoute("/reports")({
    beforeLoad: () => {
        const token = localStorage.getItem("auth_token")
        if (!token) {
            throw redirect({ to: "/login" })
        }
    },
    component: ReportsPage,
})

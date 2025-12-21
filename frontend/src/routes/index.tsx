import { createFileRoute, redirect } from "@tanstack/react-router"
import { DashboardPage } from "../pages/DashboardPage"

export const Route = createFileRoute("/")({
    beforeLoad: () => {
        const token = localStorage.getItem("auth_token")
        if (!token) {
            throw redirect({ to: "/login" })
        }
    },
    component: DashboardPage,
})

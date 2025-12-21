import { createFileRoute, redirect } from "@tanstack/react-router"
import { TimeEntriesPage } from "../pages/TimeEntriesPage"

export const Route = createFileRoute("/time-entries")({
    beforeLoad: () => {
        const token = localStorage.getItem("auth_token")
        if (!token) {
            throw redirect({ to: "/login" })
        }
    },
    component: TimeEntriesPage,
})

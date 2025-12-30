import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/projects")({
    beforeLoad: () => {
        const token = localStorage.getItem("auth_token")
        if (!token) {
            throw redirect({ to: "/login" })
        }
    },
    component: () => <Outlet />,
})

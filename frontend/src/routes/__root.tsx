import { createRootRoute, Outlet, useRouterState } from "@tanstack/react-router"
import { AppLayout } from "../components/layout/AppLayout"

const RootComponent = () => {
    const router = useRouterState()
    const currentPath = router.location.pathname

    // Don't show AppLayout on auth pages
    const isAuthPage = currentPath === "/login" || currentPath === "/register"

    if (isAuthPage) {
        return <Outlet />
    }

    return <AppLayout />
}

export const Route = createRootRoute({
    component: RootComponent,
})

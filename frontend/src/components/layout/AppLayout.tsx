import { Outlet, Link } from "@tanstack/react-router"
import { useAuth } from "../../contexts/AuthContext"
import { Button } from "../ui/button"

export const AppLayout = () => {
    const { user, logout } = useAuth()

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex space-x-8">
                            <Link
                                to="/"
                                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 border-b-2 border-transparent hover:border-gray-300"
                                activeProps={{
                                    className:
                                        "inline-flex items-center px-1 pt-1 text-sm font-medium text-blue-600 border-b-2 border-blue-500",
                                }}
                            >
                                Dashboard
                            </Link>
                            <Link
                                to="/projects"
                                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 border-b-2 border-transparent hover:border-gray-300"
                                activeProps={{
                                    className:
                                        "inline-flex items-center px-1 pt-1 text-sm font-medium text-blue-600 border-b-2 border-blue-500",
                                }}
                            >
                                Projects
                            </Link>
                            <Link
                                to="/time-entries"
                                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 border-b-2 border-transparent hover:border-gray-300"
                                activeProps={{
                                    className:
                                        "inline-flex items-center px-1 pt-1 text-sm font-medium text-blue-600 border-b-2 border-blue-500",
                                }}
                            >
                                Time Entries
                            </Link>
                            <Link
                                to="/reports"
                                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 border-b-2 border-transparent hover:border-gray-300"
                                activeProps={{
                                    className:
                                        "inline-flex items-center px-1 pt-1 text-sm font-medium text-blue-600 border-b-2 border-blue-500",
                                }}
                            >
                                Reports
                            </Link>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-700">
                                {user?.name}
                            </span>
                            <Button
                                onClick={logout}
                                variant="ghost"
                                size="sm"
                                className="text-sm"
                            >
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>
            </nav>
            <main>
                <Outlet />
            </main>
        </div>
    )
}

import { useState, type FormEvent } from "react"
import { useAuth } from "../contexts/AuthContext"
import { Link } from "@tanstack/react-router"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Button } from "../components/ui/button"
import { toast } from "sonner"

export const RegisterPage = () => {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const { register } = useAuth()

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            await register(email, password, name)
            toast.success("Account created successfully")
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : "Registration failed"
            )
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Create Account</CardTitle>
                    <CardDescription>
                        Sign up for a new Unclocked account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                minLength={2}
                                placeholder="John Doe"
                                autoComplete="name"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="you@example.com"
                                autoComplete="email"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                placeholder="••••••••"
                                autoComplete="new-password"
                            />
                        </div>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full"
                        >
                            {isLoading ? "Creating account..." : "Register"}
                        </Button>
                    </form>
                    <p className="mt-4 text-center text-sm text-gray-600">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="text-blue-600 hover:underline font-medium"
                        >
                            Login
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}

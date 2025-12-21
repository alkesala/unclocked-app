import { api } from "../lib/api"

export interface User {
    id: string
    email: string
    name: string
    role: "user" | "admin" | "superadmin"
    createdAt: string
    updatedAt: string
}

export interface LoginPayload {
    email: string
    password: string
}

export interface RegisterPayload {
    email: string
    password: string
    name: string
}

export interface AuthResponse {
    user: User
    token: string
}

export const login = async (data: LoginPayload): Promise<AuthResponse> => {
    const response = await api.post("/auth/login", data)
    return response.data
}

export const register = async (
    data: RegisterPayload
): Promise<AuthResponse> => {
    const response = await api.post("/auth/register", data)
    return response.data
}

export const getCurrentUser = async (): Promise<User> => {
    const response = await api.get("/auth/me")
    return response.data
}

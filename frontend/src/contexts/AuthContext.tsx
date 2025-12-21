import {
    createContext,
    useContext,
    useState,
    useEffect,
    type ReactNode,
} from "react"
import {
    type User,
    login as apiLogin,
    register as apiRegister,
    getCurrentUser,
} from "../api/auth"

interface AuthContextType {
    user: User | null
    isLoading: boolean
    isAuthenticated: boolean
    login: (email: string, password: string) => Promise<void>
    register: (email: string, password: string, name: string) => Promise<void>
    logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const TOKEN_KEY = "auth_token"

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    // Initialize auth state on mount
    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem(TOKEN_KEY)
            if (token) {
                try {
                    const user = await getCurrentUser()
                    setUser(user)
                } catch (error) {
                    // Token invalid or expired
                    localStorage.removeItem(TOKEN_KEY)
                }
            }
            setIsLoading(false)
        }

        initAuth()
    }, [])

    const login = async (email: string, password: string) => {
        const response = await apiLogin({ email, password })
        localStorage.setItem(TOKEN_KEY, response.token)
        setUser(response.user)
        // Navigate to home page
        window.location.href = "/"
    }

    const register = async (email: string, password: string, name: string) => {
        const response = await apiRegister({ email, password, name })
        localStorage.setItem(TOKEN_KEY, response.token)
        setUser(response.user)
        // Navigate to home page
        window.location.href = "/"
    }

    const logout = () => {
        localStorage.removeItem(TOKEN_KEY)
        setUser(null)
        window.location.href = "/login"
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated: !!user,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within AuthProvider")
    }
    return context
}

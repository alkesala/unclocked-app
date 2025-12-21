import { AccountModel } from "@/modules/account/account.model"
import { hashPassword, verifyPassword } from "@/utils/password"
import { generateToken } from "@/utils/jwt"
import type { LoginInput, RegisterInput } from "@unclocked-app/shared"

const register = async (data: RegisterInput) => {
    // Check if user already exists
    const existingUser = await AccountModel.findOne({ email: data.email })
    if (existingUser) {
        throw new Error("User already exists")
    }

    // Hash password
    const hashedPassword = await hashPassword(data.password)

    // Create user
    const user = await AccountModel.create({
        email: data.email,
        name: data.name,
        password: hashedPassword,
        role: "user",
    })

    // Generate token
    const token = generateToken({
        id: user._id.toString(),
        email: user.email,
        role: user.role,
    })

    // Return user without password
    const userObj = user.toJSON()
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    delete userObj.password

    return { user: userObj, token }
}

const login = async (data: LoginInput) => {
    // Find user with password field (normally excluded by select: false)
    const user = await AccountModel.findOne({ email: data.email }).select(
        "+password"
    )

    if (!user || !user.password) {
        throw new Error("Invalid credentials")
    }

    // Verify password
    const isValid = await verifyPassword(data.password, user.password)
    if (!isValid) {
        throw new Error("Invalid credentials")
    }

    // Generate token
    const token = generateToken({
        id: user._id.toString(),
        email: user.email,
        role: user.role,
    })

    // Return user without password
    const userObj = user.toJSON()
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    delete userObj.password

    return { user: userObj, token }
}

const getCurrentUser = async (userId: string) => {
    return AccountModel.findById(userId)
}

export const AuthService = {
    register,
    login,
    getCurrentUser,
}

import { Router } from "express"
import validator from "@/middleware/validator"
import { AuthValidator } from "@unclocked-app/shared"
import { AuthController } from "./auth.controller"
import { jwtAuth } from "@/middleware/jwt-auth"

export const AuthRouter = Router()

/**
 * Register new user
 * @route POST /api/v1/auth/register
 * @bodyParam email - User email address
 * @bodyParam password - User password (min 6 characters)
 * @bodyParam name - User full name (min 2 characters)
 */
AuthRouter.post(
    "/register",
    validator(AuthValidator.registerSchema),
    AuthController.register
)

/**
 * Login user
 * @route POST /api/v1/auth/login
 * @bodyParam email - User email address
 * @bodyParam password - User password
 */
AuthRouter.post(
    "/login",
    validator(AuthValidator.loginSchema),
    AuthController.login
)

/**
 * Get current user
 * @route GET /api/v1/auth/me
 * @requires JWT token in Authorization header
 */
AuthRouter.get("/me", jwtAuth, AuthController.me)

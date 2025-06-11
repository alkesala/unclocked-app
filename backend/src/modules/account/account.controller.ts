import { NextFunction, Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { AccountService } from "./account.service"

/**
 * Controller for managing accounts.
 * Provides methods to get account profile information.
 * The account ID is injected into the request by the authentication middleware.
 */

const getProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        if (!req.accountId) {
            res.status(StatusCodes.UNAUTHORIZED).json({
                error: "Unauthorized",
            })
            return
        }

        const account = await AccountService.findAccountById(req.accountId)

        if (!account) {
            res.status(StatusCodes.NOT_FOUND).json({
                error: "Account not found",
            })
            return
        }

        res.status(StatusCodes.OK).json(account)
    } catch (err) {
        next(err)
    }
}

export const AccountController = {
    getProfile,
}

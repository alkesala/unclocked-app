import { NextFunction, Request, Response } from "express"

export const fakeOAuth = (req: Request, _res: Response, next: NextFunction) => {
    // look for x-account-id header, fall back to the hard-coded default
    req.accountId =
        (req.headers["x-account-id"] as string) || "64a7b0f7e4b3ac2f8d1e4f56"
    req.user = {
        name: (req.headers["x-user-name"] as string) || "Fake User",
        email:
            (req.headers["x-user-email"] as string) || "fakeUser@unclocked.app",
        role: (req.headers["x-user-role"] as "user" | "admin") || "user",
    }
    next()
}

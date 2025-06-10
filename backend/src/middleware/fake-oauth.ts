import { NextFunction, Request, Response } from "express"

export const fakeOAuth = (req: Request, _res: Response, next: NextFunction) => {
    // Simulate an authenticated user
    req.accountId = "64a7b0f7e4b3ac2f8d1e4f56"
    req.user = {
        name: "Fake User",
        email: "fakeUser@unclocked.app",
        role: "user",
    }
    next()
}

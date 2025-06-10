import { Router } from "express"
import { statusController } from "./status.controller"

export const statusRouter = Router()

statusRouter.get("/status", statusController.getStatus)

// just a fakeOauth middleware check to simulate logged in user
statusRouter.get("/test-account", (req, res) => {
    res.json({
        accountId: req.accountId,
        user: req.user,
    })
})

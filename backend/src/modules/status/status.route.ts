import { Router } from "express";
import { statusController } from "./status.controller";

export const statusRouter = Router();

statusRouter.get("/status", statusController.getStatus);

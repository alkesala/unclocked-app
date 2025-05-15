import { Request, Response, NextFunction } from "express";
import { TimeEntryService } from "./timeEntry.service";
import { createTimeEntrySchema } from "./timeEntry.validator";
import { StatusCodes } from "http-status-codes";

const createTimeEntry = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const parsed = createTimeEntrySchema.parse(req.body);
        const created = await TimeEntryService.create(parsed);
        res.status(StatusCodes.CREATED).json(created);
    } catch (err) {
        next(err);
    }
};

const getAccountEntries = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const accountId = req.params.accountId;
        if (!accountId) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ error: "missing accountId" });
        }

        const entries = await TimeEntryService.getByAccount(accountId);
        res.status(StatusCodes.OK).json(entries);
    } catch (err) {
        next(err);
    }
};

export const timeEntryController = {
    createTimeEntry,
    getAccountEntries,
};

import { TimeEntryModel } from "./timeEntry.model";
import { CreateTimeEntryInput } from "./timeEntry.types";

const create = async (input: CreateTimeEntryInput) => {
    return TimeEntryModel.create(input);
};

const getByAccount = async (accountId: string) => {
    return TimeEntryModel.find({ accountId }).sort({ startedAt: -1 }).lean();
};

export const TimeEntryService = {
    create,
    getByAccount,
};

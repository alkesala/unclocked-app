import { AccountModel } from "./account.model"

/**
 * Service for managing accounts.
 * Provides methods to find or create accounts and retrieve accounts by ID.
 * Auth0 data is used to create accounts if they do not exist.
 */

const findOrCreateAccount = async (auth0Data: {
    name: string
    email: string
}) => {
    let account = await AccountModel.findOne({ email: auth0Data.email })
    if (!account) {
        account = await AccountModel.create({ auth0Data })
    }
    return account
}

const findAccountById = async (id: string) => {
    return AccountModel.findById(id)
}

export const AccountService = {
    findOrCreateAccount,
    findAccountById,
}

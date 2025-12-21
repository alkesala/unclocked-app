import * as argon2 from "argon2"

/**
 * Hash a password using Argon2id
 * @param password - Plain text password to hash
 * @returns Hashed password
 */
export const hashPassword = async (password: string): Promise<string> => {
    return argon2.hash(password, {
        type: argon2.argon2id, // Use Argon2id variant (recommended)
    })
}

/**
 * Verify a password against its hash using Argon2
 * @param password - Plain text password to verify
 * @param hash - Hashed password to compare against
 * @returns True if password matches, false otherwise
 */
export const verifyPassword = async (
    password: string,
    hash: string
): Promise<boolean> => {
    try {
        return await argon2.verify(hash, password)
    } catch {
        return false
    }
}

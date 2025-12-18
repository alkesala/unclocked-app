import { z } from "zod"
import { Types } from "mongoose"

/**
 * coerces a 24-char hex string into mongoose objectid,
 * then validates its really an ObjectId
 *
 */

export const objectId = z.preprocess(
    (validation) =>
        typeof validation === "string" && validation.length === 24
            ? new Types.ObjectId(validation)
            : validation,
    z.instanceof(Types.ObjectId)
)

/**
 * coerces any string into JS date, then validates its a Date.
 */

export const dateString = z.preprocess(
    (validation) =>
        typeof validation === "string" ? new Date(validation) : validation,
    z.date()
)

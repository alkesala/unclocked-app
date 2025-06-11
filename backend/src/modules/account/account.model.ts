import { Schema, model } from "mongoose"
// NEVER LEAK THE PW so "select: false"

const AccountSchema = new Schema<IAccount>(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        name: { type: String, required: true },
        role: {
            type: String,
            enum: ["superadmin", "admin", "user"],
            default: "user",
            required: true,
        },
        password: { type: String, select: false },
    },
    {
        timestamps: true,
        toJSON: {
            transform: (document, returnedObject) => {
                returnedObject.id = returnedObject._id.toString()
                delete returnedObject._id
                delete returnedObject.__v
            },
        },
    }
)
AccountSchema.index({ email: 1 })
export const AccountModel = model<IAccount>("Account", AccountSchema)

interface IAccount {
    readonly email: string
    name: string
    password?: string
    readonly role: "superadmin" | "admin" | "user"
    readonly createdAt: Date
    readonly updatedAt: Date
}

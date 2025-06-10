import { Schema, model } from "mongoose"
//TODO: check the permission mapping
// unique: true
// NEVER LEAK THE PW so "select: false"

const AccountSchema = new Schema<IAccount>(
    {
        email: { type: String, required: true, unique: true },
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
export const AccountModel = model<IAccount>("Account", AccountSchema)

interface IAccount {
    email: string
    name: string
    password?: string
    role: "superadmin" | "admin" | "user"
    readonly createdAt: Date
    readonly updatedAt: Date
}

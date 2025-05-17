import { Types, Schema, model } from "mongoose"

const CourseSchema = new Schema<ICourse>(
    {
        account: {
            type: Schema.Types.ObjectId,
            ref: "Account",
            required: true,
        },
        name: { type: String, required: true },
        code: { type: String, required: true },
        maxHours: { type: Number, required: true },
        isActive: { type: Boolean, required: true },
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
export const CourseModel = model<ICourse>("Course", CourseSchema)

interface ICourse {
    account: Types.ObjectId
    name: string
    code: string
    maxHours: number
    isActive: boolean
    createdAt: Date
    updatedAt: Date
}

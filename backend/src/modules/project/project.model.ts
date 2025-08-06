import { Schema, Types, model } from "mongoose"

const ProjectSchema = new Schema<IProject>(
    {
        account: {
            type: Schema.Types.ObjectId,
            ref: "Account",
            required: true,
        },
        name: { type: String, required: true },
        description: { type: String, required: true },
        isActive: { type: Boolean, required: true },
        hourlyRate: {
            type: Number,
            required: true,
            default: 0,
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform: (document, returnedObject) => {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                returnedObject.id = returnedObject._id.toString()
                delete returnedObject._id
                delete returnedObject.__v
            },
        },
    }
)
export const ProjectModel = model<IProject>("Project", ProjectSchema)

interface IProject {
    readonly account: Types.ObjectId
    name: string
    description: string
    isActive: boolean
    hourlyRate: number
    readonly createdAt: Date
    readonly updatedAt: Date
}

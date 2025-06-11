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
export const ProjectModel = model<IProject>("Project", ProjectSchema)

interface IProject {
    readonly account: Types.ObjectId
    name: string
    description: string
    isActive: boolean
    readonly createdAt: Date
    readonly updatedAt: Date
}

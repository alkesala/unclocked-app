import { Schema, Types, model } from "mongoose"

const ProjectSchema = new Schema<IProject>(
    {
        account: {
            type: Schema.Types.ObjectId,
            ref: "Account",
            required: true,
        },
        name: { type: String, required: true },
        description: { type: Text, required: true },
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
    account: Types.ObjectId
    name: string
    description: Text
    isActive: boolean
    createdAt: Date
    updatedAt: Date
}

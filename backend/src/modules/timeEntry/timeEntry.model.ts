import mongoose, { Types, Schema, model } from "mongoose"

const TimeEntrySchema = new Schema<ITimeEntry>(
    {
        account: {
            type: mongoose.Schema.ObjectId,
            ref: "Account",
            required: true,
        },
        startedAt: { type: Date, required: true },
        endedAt: { type: Date, required: true },
        project: {
            type: mongoose.Schema.ObjectId,
            ref: "Project",
            required: true,
        },
        course: {
            type: mongoose.Schema.ObjectId,
            ref: "Course",
            required: true,
        },
        note: { type: String },
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
export const TimeEntryModel = model<ITimeEntry>("TimeEntry", TimeEntrySchema)

interface ITimeEntry {
    account: Types.ObjectId
    startedAt: Date
    endedAt: Date
    project: Types.ObjectId
    course: Types.ObjectId
    note?: string
    createdAt: Date
    updatedAt: Date
}

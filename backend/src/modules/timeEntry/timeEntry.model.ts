import { Schema, Types, model } from "mongoose"

const TimeEntrySchema = new Schema<ITimeEntry>(
    {
        account: {
            type: Schema.Types.ObjectId,
            ref: "Account",
            required: true,
        },
        startedAt: { type: Date, required: true },
        endedAt: { type: Date },
        duration: { type: Number },
        project: {
            type: Schema.Types.ObjectId,
            ref: "Project",
            required: true,
        },

        note: { type: String },
        hourlyRate: { type: Number, default: undefined },
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
    readonly account: Types.ObjectId
    startedAt: Date
    endedAt: Date
    readonly project: Types.ObjectId
    note?: string
    hourlyRate: number
    readonly createdAt: Date
    duration: number
    readonly updatedAt: Date
}

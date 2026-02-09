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
            //eslint-disable-next-line
            transform: (document, returnedObject: any) => {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                returnedObject.id = returnedObject._id.toString()
                delete returnedObject._id
                delete returnedObject.__v
            },
        },
    }
)

// Indexes for query optimization
TimeEntrySchema.index({ account: 1 })
TimeEntrySchema.index({ account: 1, project: 1 })
TimeEntrySchema.index({ account: 1, project: 1, startedAt: 1 })

export const TimeEntryModel = model<ITimeEntry>("TimeEntry", TimeEntrySchema)

interface ITimeEntry {
    readonly account: Types.ObjectId
    startedAt: Date
    endedAt?: Date
    readonly project: Types.ObjectId
    note?: string
    hourlyRate?: number
    readonly createdAt: Date
    readonly updatedAt: Date
}

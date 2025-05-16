import { Schema, model } from "mongoose"

const TimeEntrySchema = new Schema(
    {
        accountId: { type: String, required: true },
        startedAt: { type: Date, required: true },
        endedAt: { type: Date, required: true },
        project: { type: String, required: true },
        course: { type: String, required: true },
        note: { type: String },
    },
    { timestamps: true }
)
export const TimeEntryModel = model("TimeEntry", TimeEntrySchema)

TimeEntrySchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    },
})

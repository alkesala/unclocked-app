import { Schema, Types, model } from "mongoose"

const ReportSchema = new Schema<IReport>(
    {
        account: {
            type: Schema.Types.ObjectId,
            ref: "Account",
            required: true,
        },
        project: {
            type: Schema.Types.ObjectId,
            ref: "Project",
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        rangeStart: {
            type: Date,
            required: true,
        },
        rangeEnd: {
            type: Date,
            required: true,
        },
        totalHours: {
            type: Number,
            required: true,
        },
        totalEarnings: {
            type: Number,
            required: true,
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
ReportSchema.index({ account: 1, project: 1 })
export const ReportModel = model<IReport>("Report", ReportSchema, "reports")

interface IReport {
    readonly account: Types.ObjectId
    readonly project: Types.ObjectId
    name: string
    rangeStart: Date
    rangeEnd: Date
    totalHours: number
    totalEarnings: number // in cents
    readonly createdAt: Date
    readonly updatedAt: Date
}

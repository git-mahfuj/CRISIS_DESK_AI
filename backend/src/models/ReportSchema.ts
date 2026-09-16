import mongoose, { Schema, Document, model } from "mongoose";

export interface IReport  {
    _id: string,
    name: string,
    contact: string,
    location: string,
    description: string,
    language?: string,
    category?: string,
    urgency?: string,
    summary?: string,
    suggestedAction?: string,
    confidence?: number,
    possibleDuplicate: boolean,
    matchedReportID: string | null
    status: string,
}


const reportSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    contact: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    language: {
        type: String,
        enum: ["bn", "en", "unknown"],
        default: "en"
    },

    category: {
        type: String,
        enum: ["medical", "fire", "accident", "crime", "flood", "utility", "public_service", "infrastructure", "other"],
        default: "medical"
    },
    urgency: {
        type: String,
        enum: ["low", "medium", "high", "critical"],
        default: "low"
    },
    summary: {
        type: String,
        trim: true,
        default: "summary"
    },
    suggestedAction: {
        type: String,
        trim: true,
        default: "action"
    },
    confidence: {
        type: Number,
        default: 0,
        min: 0,
        max: 1
    },
    possibleDuplicate: { type: Boolean, default: false },
    matchedReportId: { type: String, default: null },

    status: {
        type: String,
        enum: ["pending", "in_review", "assigned", "resolved", "rejected"],
        default: "pending"
    }
},
    {
        timestamps: true,
    }
)

export const Report = mongoose.model<IReport>("Report", reportSchema)
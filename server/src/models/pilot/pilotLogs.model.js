import mongoose, { Schema } from "mongoose"
const pilotLogs = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    flightName: {
        type: String,
        required: true,
        trim: true
    },
    project: {
        type: Schema.Types.ObjectId,
        ref: "PilotProject",
        required: true,
    },

    location: {
        type: String,
        required: true,
        trim: true
    },
    flightDate: {
        type: Date,
        required: true,
    },
    duration: {
        hr: {
            type: Number,
            required: true,
            default: 0
        },
        min: {
            type: Number,
            required: true,
            default: 0
        },
        sec: {
            type: Number,
            required: true,
            default: 0
        },

    },
    rangeCovered:{
        type: Number,
        required: true,
    },
    flightType: {
        type: String,
        required: true,
    },
    remark: {
        type: String,
        // required: true,
    }

}, { timestamps: true });

export const PilotLog = mongoose.model('PilotLog', pilotLogs);
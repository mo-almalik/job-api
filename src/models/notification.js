import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    message: {
        type: String,
        required: true
    },
    isRead:{
        type: Boolean,
        default: false
    },
    type:{
        type: String,
        enum: ["info", "warning", "error"],
        default: "info"
    }
},{
    timestamps: true
})

export const Notification = mongoose.model("Notification", notificationSchema);
import mongoose from "mongoose";

const savedJobSchema = new mongoose.Schema({
    seekerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    
},{
    timestamps: true
})

export const SavedJob = mongoose.model("SavedJob",savedJobSchema)
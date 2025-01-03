import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
const applicationSchema = new mongoose.Schema({
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    seekerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    coverLetter: {
        type: String
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    },
    resume:{
        type: String,
        required: true
    },


},{
    timestamps: true,
})
applicationSchema.plugin(mongoosePaginate);
export const Application =  mongoose.model('Application', applicationSchema)
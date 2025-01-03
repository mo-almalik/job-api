import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        minlength: 5,
        maxlength: 50
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        minlength: 10,
        maxlength: 500
    },
    location:{
        country: String,
        region: String,
        city: String,
    },
    skills: {
        type: [String],
    },
    companyId: {
        type: mongoose.Types.ObjectId,
        ref: "Company",
        required: [true, "Company is required"]
    },
    salary: {
        type: Number,
    },
    jobType:{
        type: String,
        required: [true, "Job type is required"],
        enum:["Full-time", "Part-time", "Contract","Freelance", "Remote","Internship" ]
    },
    employerId:{
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: [true, "Employer is required"]
    },
    requirements:{
        type: String,
        required: [true, "Requirements are required"]
    },
    isActive:{
        type: Boolean,
        default: true
    },
    status: {
        type: String,
        enum: ['open', 'closed', 'expired'],
        default: 'open'
    },
    views:{
        type: Number,
        default: 0
    }
},{
    timestamps: true
})
jobSchema.methods.incrementViews = function () {
    this.views += 1;
    return this.save();
};
jobSchema.plugin(mongoosePaginate);
export default mongoose.model("Job", jobSchema)
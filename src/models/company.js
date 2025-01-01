import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Company name is required"],
        unique: true
    },
    logo: {
        type: String,
        required: [true, "Company logo is required"]
    },
    cover:{
        type: String,
    },
    address: {
        type: String,
        required: [true, "Company address is required"],
    },
    description: {
        type: String,
        required: [true, "Company description is required"]
    },
    employeesId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    contactInfo :{
       email:{
         type: String,
         required: [true, "Company email is required"],
         unique: true,
         match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
       },
       website:{
         type: String,
         required: [true, "Company website URL is required"]
       },
    },
},{
    timestamps: true,
})

export const Company = mongoose.model("Company", companySchema)
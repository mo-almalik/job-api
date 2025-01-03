import fs from "fs"
import bcrypt from "bcrypt"
import Job from  "../../models/job.js"
import { catchError, AppError } from "../../../utils/error.js"
import {Company} from "../../models/company.js";


//create job
export const createJob = catchError(async (req, res) => {
     const companyId = req.params.id
    const employerId = req.user.id

    const checkCompany = await Company.findById(companyId)
    if (!checkCompany || employerId !== checkCompany.employeesId.toString()) {
        return res.status(400).json({
            message:'لم يتم العثور علي الشركة'
        })
    }
    if(req.body){
        req.body.employerId = employerId
        req.body.companyId  = companyId
    }
    const newJob = await  Job.create(req.body)
    res.status(201).json({
        message: 'تم إنشاء الوظيفة بنجاح',
        data: newJob
    })

})

// get all jobs
export const getAllJob = catchError(async (req,res)=>{
    const {  page = 1, limit = 12, location , status } = req.query;
    let filters = {};
    //
    if (location) filters.location = location;
    if (status) filters.status = status;

    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: { createdAt: -1 },
        populate: {path: 'companyId', select: 'name logo' }

    };
    const jobs = await  Job.paginate(filters,options)
    res.json({
        data:jobs
    })
})

//get job by company id
export const getJobsByCompanyId = catchError(async (req, res) => {
    const {  page = 1, limit = 12 } = req.query;
    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: { createdAt: -1 },
        // populate: {path: 'companyId', select: 'name logo cover address description' },
        select:'-employerId -companyId'

    };
    const companyId = req.params.id;

    const jobs = await Job.paginate({ companyId } ,options);

    if (jobs.length === 0 || !jobs) {
        return res.status(404).json({ message: "لم يتم العثور على وظائف لهذه الشركة" });
    }
    res.json({ data: jobs });
});

// get job by id
export const getJobById = catchError(async (req,res)=>{
    const {id} = req.params
    const job = await Job.findById(id).populate('companyId' ,'name logo cover description address ')
        .select('-employerId')
    if(!job) return res.status(404).json({message : "لم يتم العثور علي الوظيفة"})
    res.json({data:job})
})

//update the job
//TODO:update functions

//delete job
export const deleteJob = catchError(async (req,res)=>{

})

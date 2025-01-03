
import {AppError, catchError} from "../../../utils/error.js";
import Job from "../../models/job.js";
import {Application} from "../../models/application.js";
import fs from "fs";
import {populate} from "dotenv";



//create application => seeker only
export  const createApplication = catchError(async (req,res)=>{

    const jobId = req.params.id;
    const seekerId = req.user.id;
    const {coverLetter} =req.body
try{

    const job = await Job.findById(jobId)

    if(!job) return res.status(404).json({ message :"الوظيفة غير متوفرة"})

    if(job.status !== "open") return res.status(400).json({message :'لم يعد التقديم  متاح للوظيفة'})

    if(!req.file){
        throw  new AppError( 'الCv مطلوب' , 400)
    }

    if (req.file.mimetype !== "application/pdf") {
        throw new AppError("يجب أن يكون الملف بصيغة PDF فقط", 400);
    }

    const resumePath = req.file.path;


    await Application.create({seekerId,coverLetter,jobId,resume:resumePath})
    res.status(201).json({message:"تم التقديم بنجاح"})
}catch (e) {
    if(req.file){
        fs.unlinkSync(req.file.path);
    }
    throw e;
}
})

//get all applications => admin only
export const getAllApplication = catchError(async (req,res)=>{
    const {page=1 ,
        limit = 12 ,
        sortBy = "createdAt",
        order = "desc",
        status
    } = req.query
    const filters= {}
    if (status) {
        filters.status = status;
    }

    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        sort: { [sortBy]: order === "asc" ? 1 : -1 },
        populate: {
            path: "jobId",
            select: "title",
            populate: {
                path: "companyId",
                select: "name logo ",
            },
        },
        select:'-updatedAt -seekerId'
    }
    const application = await Application.paginate(filters, options);
    res.json({
        data:application
    })
})

//get application by id =>employee or seeker
export const getMyApplication = catchError(async (req,res)=>{
    const {page=1 ,
        limit = 12 ,
        sortBy = "createdAt",
        order = "desc",
        status
    } = req.query
    const filter = { seekerId: req.user.id };
    if (status) {
        filter.status = status;
    }
    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        sort: { [sortBy]: order === "asc" ? 1 : -1 },
        populate: {
            path: "jobId",
            select: "-employerId ",
            populate: {
                path: "companyId",
                select: "name logo address",
            },
        },
        select:'-updatedAt -seekerId'
    };

    const myApply = await Application.paginate(filter, options);

    res.json({
        data:myApply
    })
})

//update application => employee

//delete application => employee

//get all application by employee id

//get all application by job id

import {AppError, catchError} from "../../../utils/error.js";
import Job from "../../models/job.js";
import {Application} from "../../models/application.js";
import fs from "fs";

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
export const updateApplication= catchError(async (req,res)=>{
    const {applicationId ,status} = req.body
    const user = req.user.id
    const application = await  Application.findById(applicationId)
    const job = await Job.findOne({employerId:user})

    if (!application || application.jobId.toString() !== job._id.toString()) {
        throw  new AppError('الوظيفة غير متوفرة' ,404)
    }
    const update = await Application.findByIdAndUpdate(applicationId,{
        status
    },{new:true})

    res.json({
        message:"تم تحديث الحالة",
        data:update
    })


})

//delete application => employee
export const deleteApplication= catchError(async (req,res)=>{
    const applicationId= req.params.id
    const user = req.user.id
    const application = await  Application.findById(applicationId)
    const job = await Job.findOne({employerId:user})
    console.log(application.jobId)
    console.log(job._id)
    if (!application || application.jobId.toString() !== job._id.toString()) {
        throw  new AppError('الطلب غير متوفرة' ,404)
    }

    try {
        if (application.resume) {
            fs.unlinkSync(application.resume);
        }
    } catch (error) {
        console.error('خطأ أثناء حذف ملف السيرة الذاتية:', error.message);
    }

    await Application.findByIdAndDelete(applicationId);

    res.json({
        message:"تم الحذف بنجاح"
    })
})

//get all application by employee id

export const getAllApplicationByUserLoggedIn = catchError(async (req, res) => {
    const {
        page = 1,
        limit = 12,
        sortBy = "createdAt",
        order = "desc",
        status,
    } = req.query;


    const jobs = await Job.find({ employerId: req.user.id });
    if (jobs.length === 0) {
        return res.status(404).json({ message: "لا توجد وظائف مرتبطة بهذا المستخدم." });
    }

    const jobIds = jobs.map(job => job._id);
    const filters = { jobId: { $in: jobIds } };
    if (status) {
        filters.status = status;
    }

    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        sort: { [sortBy]: order === "asc" ? 1 : -1 },
        populate: [({
            path: "jobId",
            select: "title",
            populate: {
                path: "companyId",
                select: "name logo",
            },

        }),({
            path:"seekerId",
            select: "skills experiences education name username"
        })],
        select: '-updatedAt ',
    };

    const applications = await Application.paginate(filters, options);

    res.json({
        data: applications,
    });
});


//get all application by job id


export const getAllApplicationByJobId = catchError(async (req, res) => {
    const {
        page = 1,
        limit = 12,
        sortBy = "createdAt",
        order = "desc",
        status,
    } = req.query;

    const jobId = req.params.id;
    const userId = req.user.id;

    const job = await Job.findById(jobId);
    if (!job) {
        throw new AppError("هذه الوظيفة غير موجودة", 404);
    }

    if (job.employerId.toString() !== userId) {
        throw new AppError("ليس لديك صلاحية الوصول لهذه الوظيفة", 403);
    }

    const filters = { jobId: job._id };
    if (status) {
        filters.status = status;
    }

    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        sort: { [sortBy]: order === "asc" ? 1 : -1 },
        populate: [
            ({
                path: "seekerId",
                select: "name skills experiences education",
            }),
            ({
                path:'jobId',
                select: "title"
            })
        ],
        select: "-updatedAt",
    };

    const applications = await Application.paginate(filters, options);

    res.status(200).json({
        success: true,
        data: applications,
    });
});

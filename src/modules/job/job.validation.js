import Joi from "joi";


export const createJobSchema = Joi.object({
    title: Joi.string().min(5).max(50).required(),
    description: Joi.string().min(10).max(500).required(),
    location:Joi.object({
        country: Joi.string().required(),
        region: Joi.string(),
        city: Joi.string(),
    }).required(),
    skills:Joi.array().items(Joi.string()).required(),
    // companyId: Joi.string().hex().length(24).required(),
    id: Joi.string().hex().length(24).required(),
    salary:Joi.number(),
    jobType:Joi.string().valid("Full-time", "Part-time", "Contract","Freelance", "Remote","Internship").required(),
    requirements:Joi.string().min(10).max(500).required(),

})


export const querySchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(15),
    location: Joi.string().trim().min(2).max(100),
    status: Joi.string().valid('open', 'closed', 'expired').insensitive(),
    salaryMin: Joi.number().min(0),
    salaryMax: Joi.number().min(0),
    jobType: Joi.string().valid('full_time', 'part_time', 'remote'),
    sortBy: Joi.string().valid('salary', 'createdAt', 'title'),
    order: Joi.string().valid('asc', 'desc').default('asc')
});
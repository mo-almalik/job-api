import Joi from "joi";

export const  createApplicationSchema = Joi.object({
    coverLetter:Joi.string().min(0).min(300),
    id:Joi.string().hex().length(24).required(),
})
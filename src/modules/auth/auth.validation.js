import Joi from "joi";

export const RegisterSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    role: Joi.string().valid('admin', 'job_seeker', 'employer'),
    name: Joi.string().required(),
    profileImage:Joi.string(),
})

export const LoginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
})
import Joi from "joi";

export const addCompanySchema = Joi.object({
    name: Joi.string().trim().required(),
    address: Joi.string().required(),
    description: Joi.string().required(),
    contactInfo: Joi.object({
        email: Joi.string().email().allow(null, ''),
        website: Joi.string().allow(null, ''),
    }).allow(null, {})
})

export const updateCompanySchema = Joi.object({
    name: Joi.string(),
    address: Joi.string(),
    description: Joi.string(),
    contactInfo: Joi.object({
        email: Joi.string().email().allow(null, ''),
        website: Joi.string().allow(null, ''),
    }).allow(null, {}),
    id:Joi.string().hex().length(24).required()
})
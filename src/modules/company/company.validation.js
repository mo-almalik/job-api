import Joi from "joi";

export const addCompanySchema = Joi.object({
    name: Joi.string().required(),
    address: Joi.string().required(),
    description: Joi.string().required(),
    contactInfo: Joi.object({
        email: Joi.string().email().allow(null, ''),
        website: Joi.string().allow(null, ''),
    }).allow(null, {})
})
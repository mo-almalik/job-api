import Joi from "joi";

export const userUpdateSchema = Joi.object({
    email: Joi.string()
        .email({ tlds: { allow: false } })
        .messages({
            'string.empty': 'Email is required',
            'string.email': 'Invalid email format'
        }),
    name: Joi.string(),
    profileImage: Joi.string(),
    phone: Joi.string()
        .pattern(/^\+?[0-9]{10,15}$/)
        .messages({
            'string.pattern.base': 'Phone number must be a valid format with 10-15 digits'
        }),
    skills: Joi.array()
        .items(Joi.string())
        .messages({
            'array.includes': 'Skills must be an array of strings'
        }),
    experiences: Joi.array()
        .items(
            Joi.object({
                title: Joi.string().required(),
                company: Joi.string().required(),
                location: Joi.string(),
                from: Joi.date().required(),
                to: Joi.date().allow(null),
                current: Joi.boolean().default(false),
                description: Joi.string().allow(null, '')
            })
        ),

    education: Joi.array()
        .items(
            Joi.object({
                institution: Joi.string().required(),
                degree: Joi.string(),
                fieldOfStudy: Joi.string(),
                from: Joi.date().required(),
                to: Joi.date().allow(null),
                current: Joi.boolean().default(false)
            })
        ),

    location: Joi.object({
        address: Joi.string().allow(null, ''),
        city: Joi.string().allow(null, ''),
        country: Joi.string().allow(null, '')
    }).allow(null, {})
})
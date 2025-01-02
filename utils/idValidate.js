import Joi from "joi";


const idValidate = Joi.object({
    id: Joi.string().hex().length(24).required(),
})

export default idValidate;
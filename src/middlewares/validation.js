import fs from 'fs';
import AppError from '../../utils/error.js'

export const validate = (schema)=>{
    return (req,res,next)=>{
        const {error} = schema.validate({
            body: req.body,
            query: req.query,
            params: req.params
        },{
            abortEarly: false
        })
        
        if(error){
           const errors = error.details.map(err=>err.message);
           if(req.file){
            fs.unlinkSync(req.file.path)
                }
            throw new AppError(400, errors.join(', '))
        }else{
            next();
        }
    }
}
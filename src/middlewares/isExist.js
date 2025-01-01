import { AppError } from "../../utils/error.js"
import fs from 'fs'

export const isExists = (model, label) => {
    return async (req, res, next) => {
        const value = req.body[label]; 
        if (!value) {
            return next(new AppError(`The field ${label} is required`, 400));
        }

        const item = await model.findOne({ [label]: value }); 
        if (item) {
            
            if(req.file){
                fs.unlinkSync(req.file.path)
            }
            return next(new AppError(`This ${label} already exists`, 409));
    
        }

        next(); 
    };
};

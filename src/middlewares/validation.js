import fs from 'fs';
import {AppError} from '../../utils/error.js'

export const validate = (schema) => {
    return (req, res, next) => {
      const { error } = schema.validate({ ...req.body, ...req.params, ...req.query }, { abortEarly: false });
      
      if (error) {
        const { details } = error;
  
        const messages = details.map(i => i.message.replace(/["/]/g, '')); 
        if(req.file || req.files){
          fs.unlinkSync(req.file.path || req.files.path);

        }
        next(new AppError(messages.join(', '), 403));
      } else {
        next();
      }
    };
  };
  
export class AppError extends Error {
    constructor(message,statusCode){
        super(message)
        this.message = message
        this.statusCode = statusCode
    }
}


export const catchError= (fn)=>{
    return (req,res,next)=>{
        fn(req,res,next).catch((error)=>next(error))
    }
}
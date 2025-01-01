export class AppError extends Error{
    constructor(message ,status){
        super(message)
        this.status = status
    }
}




export const catchError= (fn)=>{
    return (req,res,next)=>{
        fn(req,res,next).catch((error)=>next(error))
    }
}
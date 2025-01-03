import {AppError, catchError} from "../../../utils/error.js";
import {Application} from "../../models/application.js";

export const checkIfApply = catchError(async (req, res, next) => {
    const jobId = req.params.id
const check = await Application.findOne({seekerId:req.user.id})

    if (check && jobId === check.jobId.toString() ) {
        throw new AppError("تم التقديم علي الوظيفة مسبقا",403)
    }


    next()

})
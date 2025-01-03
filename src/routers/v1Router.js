import { Router } from "express";
import jobRouter from "../modules/job/job.router.js";
import userRouter from "../modules/user/user.router.js"
import authRouter from "../modules/auth/auth.router.js"
import companyRouter from "../modules/company/company.router.js";
import applicationRouter from "../modules/application/application.router.js";

const router = Router();

router.use('/application',applicationRouter)
router.use('/company',companyRouter)
router.use('/auth',authRouter)
router.use('/user',userRouter)
router.use('/job',jobRouter)


export default router
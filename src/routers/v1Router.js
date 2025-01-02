import { Router } from "express";
import authRouter from "../modules/auth/auth.router.js"
import userRouter from "../modules/user/user.router.js"

const router = Router();

router.use('/auth',authRouter)
router.use('/user',userRouter)

export default router
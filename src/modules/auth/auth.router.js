import { Router } from "express";
import { Login, Register } from "./auth.controller.js";
import { validate } from "../../middlewares/validation.js";
import { LoginSchema, RegisterSchema } from "./auth.validation.js";
import { isExists } from "../../middlewares/isExist.js";
import { User } from "../../models/user.js";
import  {upload} from "../../middlewares/upload.js"

const router = Router();

router.post('/register',upload.single('profileImage'),isExists(User,'email'),validate(RegisterSchema),Register)
router.post('/login',validate(LoginSchema),Login)



export default router
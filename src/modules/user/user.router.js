import { Router } from "express";
import { authentication } from "../auth/auth.middleware.js";
import { getMyAccount, updateAccount } from "./user.controller.js";
import { upload } from "../../middlewares/upload.js";
import {isExists} from "../../middlewares/isExist.js";
import { User } from "../../models/user.js";
import {validate} from "../../middlewares/validation.js";
import {userUpdateSchema} from "./user.validation.js";

const router = Router()

router.get('/', authentication, getMyAccount);
router.patch('/update', authentication,upload.single('profileImage'),validate(userUpdateSchema), updateAccount);

export default router
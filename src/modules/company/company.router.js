import { Router } from "express";
import {authentication, authorize} from "../auth/auth.middleware.js";
import {createNewCompany, deleteCompany} from "./company.controller.js";
import { upload } from "../../middlewares/upload.js";
import {validate} from "../../middlewares/validation.js";
import {addCompanySchema} from "./company.validation.js";
import {Role} from "../../../utils/enum.js";
import idValidate from "../../../utils/idValidate.js";

const router = Router()

router.post('/', authentication,authorize(Role.EMPLOYER), upload.fields([{name:'logo', maxCount:1} , {name:'cover',maxCount: 1}]),validate(addCompanySchema),createNewCompany);
router.delete('/:id', authentication,authorize(Role.EMPLOYER), validate(idValidate),deleteCompany);


export default router
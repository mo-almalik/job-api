import Router from 'express';
import {authentication, authorize} from "../auth/auth.middleware.js";
import {Role} from "../../../utils/enum.js";
import {upload} from "../../middlewares/upload.js";
import {validate} from "../../middlewares/validation.js";
import {createApplication, getAllApplication, getMyApplication} from "./application.controller.js";
import {createApplicationSchema} from "./application.validation.js";

const router = Router();

router.post('/apply/:id',authentication,authorize(Role.JOB_SEEKER),upload.single('resume'),validate(createApplicationSchema),createApplication)
router.get('/all' ,authentication,authorize(Role.ADMIN),getAllApplication)
router.get('/myApply' ,authentication,authorize(Role.JOB_SEEKER),getMyApplication)
export default router;
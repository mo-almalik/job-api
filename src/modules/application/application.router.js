import Router from 'express';
import {authentication, authorize} from "../auth/auth.middleware.js";
import {Role} from "../../../utils/enum.js";
import {upload} from "../../middlewares/upload.js";
import {validate} from "../../middlewares/validation.js";
import {
    createApplication,
    deleteApplication,
    getAllApplication, getAllApplicationByJobId,
    getAllApplicationByUserLoggedIn,
    getMyApplication,
    updateApplication
} from "./application.controller.js";
import {createApplicationSchema, updateStatsSchema} from "./application.validation.js";
import idValidate from "../../../utils/idValidate.js";
import {checkIfApply} from "./application.middleware.js";

const router = Router();

router.post('/apply/:id',authentication,authorize(Role.JOB_SEEKER),checkIfApply,upload.single('resume'),validate(createApplicationSchema),createApplication)
router.get('/all' ,authentication,authorize(Role.ADMIN),getAllApplication)
router.get('/all-app' ,authentication,authorize(Role.EMPLOYER),getAllApplicationByUserLoggedIn)
router.get('/myApply' ,authentication,authorize(Role.JOB_SEEKER),getMyApplication)
router.patch('/status',authentication,authorize(Role.EMPLOYER),validate(updateStatsSchema),updateApplication)
router.delete('/:id',authentication,authorize(Role.EMPLOYER),validate(idValidate),deleteApplication)
router.get('/:id',authentication,authorize(Role.EMPLOYER),validate(idValidate),getAllApplicationByJobId)

export default router;
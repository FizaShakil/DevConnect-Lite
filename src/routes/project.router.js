import { Router } from "express";
import { createProject, getProjectBids, openProject, exportProjects } from "../controllers/project.controller.js";
import {verifyJWT} from '../middlewares/auth.middleware.js'
import {checkRole }from '../middlewares/checkrole.middleware.js'

const projectRouter = Router()

projectRouter.route('/create').post(verifyJWT, checkRole("user"), createProject)
projectRouter.route('/open').get(verifyJWT, checkRole("developer"), openProject)
projectRouter.route('/:id/bids').get(verifyJWT, checkRole("user"), getProjectBids)
projectRouter.route("/export").get(verifyJWT,checkRole("user"), exportProjects);

export default projectRouter

import { Router } from "express";
import { placeBid } from "../controllers/bid.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { checkRole } from "../middlewares/checkrole.middleware.js";

const bidRouter = Router()

bidRouter.route('/place/:projectId').post(verifyJWT, checkRole("developer"), placeBid)

export default bidRouter 
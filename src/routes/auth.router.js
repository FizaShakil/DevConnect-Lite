import { Router } from "express";
import { developerSignup, login, userSignup } from "../controllers/auth.controller.js";

const authRouter = Router()

authRouter.route('/signup/user').post(userSignup)
authRouter.route('/signup/developer').post(developerSignup)
authRouter.route('/login').post(login)

export default authRouter
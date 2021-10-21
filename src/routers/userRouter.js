import express from "express";
import {getUser, getUserModify, postUserModify
    } from "../controllers/userController";
import { protectLogin } from "../middlewares";

const userRouter = express.Router();

userRouter.route("/:id").all(protectLogin).get(getUser);
userRouter.route("/:id/modify").all(protectLogin).get(getUserModify).post(postUserModify);

export default userRouter;
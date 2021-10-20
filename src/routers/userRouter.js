import express from "express";
import {getUser, getUserModify, postUserModify
    } from "../controllers/userController";

const userRouter = express.Router();

userRouter.route("/:id").get(getUser);
userRouter.route("/:id/modify").get(getUserModify).post(postUserModify);

export default userRouter;
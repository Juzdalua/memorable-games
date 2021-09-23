import express from "express";
import {createComment} from "../controllers/steamController";

const apiRouter = express.Router();

apiRouter.route("/steams/:id/comment").post(createComment);


export default apiRouter;
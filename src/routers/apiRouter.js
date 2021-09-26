import express from "express";
import {createComment, deleteComment} from "../controllers/steamController";

const apiRouter = express.Router();

apiRouter.route("/steams/:id/comment").post(createComment);
apiRouter.route("/steams/:id/comment/delete").post(deleteComment);


export default apiRouter;
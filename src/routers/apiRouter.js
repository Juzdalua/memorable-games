import express from "express";
import {createComment, deleteComment} from "../controllers/gameController";
import {createCommentCommunity, deleteCommentCommunity} from "../controllers/communityController";
import { protectLogin } from "../middlewares";

const apiRouter = express.Router();

apiRouter.route("/games/:id/comment").all(protectLogin).post(createComment);
apiRouter.route("/games/:id/comment/delete").all(protectLogin).post(deleteComment);
apiRouter.route("/community/:id/comment").all(protectLogin).post(createCommentCommunity);
apiRouter.route("/community/:id/comment/delete").all(protectLogin).post(deleteCommentCommunity);


export default apiRouter;
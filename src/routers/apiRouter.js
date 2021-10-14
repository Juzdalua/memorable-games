import express from "express";
import {createComment, deleteComment} from "../controllers/gameController";
import {createCommentCommunity, deleteCommentCommunity} from "../controllers/communityController";

const apiRouter = express.Router();

apiRouter.route("/games/:id/comment").post(createComment);
apiRouter.route("/games/:id/comment/delete").post(deleteComment);
apiRouter.route("/community/:id/comment").post(createCommentCommunity);
apiRouter.route("/community/:id/comment/delete").post(deleteCommentCommunity);


export default apiRouter;
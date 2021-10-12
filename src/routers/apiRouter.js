import express from "express";
import {createComment, deleteComment} from "../controllers/gameController";

const apiRouter = express.Router();

apiRouter.route("/games/:id/comment").post(createComment);
apiRouter.route("/games/:id/comment/delete").post(deleteComment);


export default apiRouter;
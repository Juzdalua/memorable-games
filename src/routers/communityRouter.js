import express from "express";
import {getCommunityList, getCommunityWrite, postCommunityWrite,
    getCommunity, getArticleLike, getArticleDislike} from "../controllers/communityController";
import {imageUpload} from "../middlewares";
import { protectLogin } from "../middlewares";

const communityRouter = express.Router();

communityRouter.route("/").get(getCommunityList);
communityRouter.route("/write").all(protectLogin).get(getCommunityWrite).post(imageUpload.single("image"), postCommunityWrite);
communityRouter.route("/:id").get(getCommunity);
communityRouter.route("/:id/like").get(getArticleLike);
communityRouter.route("/:id/dislike").get(getArticleDislike);

export default communityRouter;
import express from "express";
import {getCommunityList, getCommunityWrite, postCommunityWrite} from "../controllers/communityController";
import {imageUpload} from "../middlewares";

const communityRouter = express.Router();

communityRouter.route("/").get(getCommunityList);
communityRouter.route("/write").get(getCommunityWrite).post(imageUpload.single("image"), postCommunityWrite);

export default communityRouter;
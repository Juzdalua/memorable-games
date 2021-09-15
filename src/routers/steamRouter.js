import express from "express";
import {getSteamList, getSteamWrite, postSteamWrite,
    getSteam, getSteamLike, getSteamDislike } from "../controllers/steamController";
import {videoUpload} from "../middlewares";

const steamRouter = express.Router();

steamRouter.route("/").get(getSteamList);
steamRouter.route("/write").get(getSteamWrite).post(videoUpload.single("video"), postSteamWrite);
steamRouter.route("/:id").get(getSteam);
steamRouter.route("/:id/like").get(getSteamLike);
steamRouter.route("/:id/dislike").get(getSteamDislike);

export default steamRouter;
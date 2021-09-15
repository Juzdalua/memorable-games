import express from "express";
import {getSteamList, getSteamWrite, postSteamWrite,
    getSteam } from "../controllers/steamController";
import {videoUpload} from "../middlewares";

const steamRouter = express.Router();

steamRouter.route("/").get(getSteamList);
steamRouter.route("/write").get(getSteamWrite).post(videoUpload.single("video"), postSteamWrite);
steamRouter.route("/:id").get(getSteam);

export default steamRouter;
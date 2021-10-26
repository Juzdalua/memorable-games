import express from "express";
import {getGameList, getGameWrite, postGameWrite,
    getGame, getGameLike, getGameDislike } from "../controllers/gameController";
import {videoUpload} from "../middlewares";
import {protectLogin} from "../middlewares";

const gameRouter = express.Router();

gameRouter.route("/").get(getGameList);
gameRouter.route("/write").all(protectLogin).get(getGameWrite).post(videoUpload.fields([
    {name:"video", maxCount:1}, {name:"image", maxCount:1}
]), postGameWrite);
gameRouter.route("/:id").get(getGame);
gameRouter.route("/:id/like").get(getGameLike);
gameRouter.route("/:id/dislike").get(getGameDislike);

export default gameRouter;
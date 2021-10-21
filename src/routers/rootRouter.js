import express from "express";
import {home} from "../controllers/rootController";
import {getJoin, postJoin,
    getLogin, postLogin, getLogout} from "../controllers/userController";
import { protectLogin } from "../middlewares";
import { publicLogin } from "../middlewares";

const rootRouter = express.Router();

rootRouter.route("/").get(home);
rootRouter.route("/join").all(publicLogin).get(getJoin).post(postJoin);
rootRouter.route("/login").all(publicLogin).get(getLogin).post(postLogin);
rootRouter.route("/logout").all(protectLogin).get(getLogout);

export default rootRouter;
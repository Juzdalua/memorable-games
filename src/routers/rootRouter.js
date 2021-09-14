import express from "express";
import {home} from "../controllers/rootController";
import {getJoin, postJoin,
    getLogin, postLogin, getLogout} from "../controllers/userController";

const rootRouter = express.Router();

rootRouter.route("/").get(home);
rootRouter.route("/join").get(getJoin).post(postJoin);
rootRouter.route("/login").get(getLogin).post(postLogin);
rootRouter.route("/logout").get(getLogout);

export default rootRouter;
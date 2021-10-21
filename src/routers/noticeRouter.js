import express from "express";
import {getNoticeList, getWrite, postWrite,
    getNotice, getNoticeModify, postNoticeModify, deleteNotice} from "../controllers/noticeController";
import { protectLogin } from "../middlewares";

const noticeRouter = express.Router();

noticeRouter.route("/").get(getNoticeList);
noticeRouter.route("/write").all(protectLogin).get(getWrite).post(postWrite);
noticeRouter.route(`/:id`).get(getNotice);
noticeRouter.route(`/:id/modify`).all(protectLogin).get(getNoticeModify).post(postNoticeModify);
noticeRouter.route(`/:id/delete`).all(protectLogin).get(deleteNotice);

export default noticeRouter;
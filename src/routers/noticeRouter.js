import express from "express";
import {getNoticeList, getWrite, postWrite,
    getNotice, getNoticeModify, postNoticeModify, deleteNotice} from "../controllers/noticeController";

const noticeRouter = express.Router();

noticeRouter.route("/").get(getNoticeList);
noticeRouter.route("/write").get(getWrite).post(postWrite);
noticeRouter.route(`/:id`).get(getNotice);
noticeRouter.route(`/:id/modify`).get(getNoticeModify).post(postNoticeModify);
noticeRouter.route(`/:id/delete`).get(deleteNotice);

export default noticeRouter;
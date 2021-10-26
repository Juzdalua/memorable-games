import "regenerator-runtime";
import "dotenv/config";
import express from "express";
import rootRouter from "./routers/rootRouter";
import noticeRouter from "./routers/noticeRouter";
import gameRouter from "./routers/gameRouter";
import communityRouter from "./routers/communityRouter";
import userRouter from "./routers/userRouter";
import apiRouter from "./routers/apiRouter";
import bodyParser from "body-parser";
import "./db";
import session from "express-session";
import MongoStore from "connect-mongo";
import {localsMiddlewares} from "./middlewares";

const PORT = process.env.PORT || 4000;
const app = express();


app.set("view engine", 'pug');
app.set("views", process.cwd()+"/src/views");
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
    store: MongoStore.create({mongoUrl: 'mongodb://127.0.0.1:27017/memorable-games'})
  }));


app.use(localsMiddlewares);
app.use("/uploads", express.static("uploads"));
app.use('/', rootRouter);
app.use('/notice', noticeRouter);
app.use('/games', gameRouter);
app.use('/community', communityRouter);
app.use(`/user`, userRouter);
app.use('/api', apiRouter);

//404 Uncorrect URL
app.use( (req, res, next)=>{
    res.status(404).render("404", {pageTitle:" | 404"});
});

app.listen(PORT, ()=>{
    console.log(`😃 Conneted server, PORT: ${PORT}`);
})
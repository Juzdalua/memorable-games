import express from "express";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import bodyParser from "body-parser";
import "./db";
import session from "express-session";
import MongoStore from "connect-mongo";
import {localsMiddlewares} from "./middlewares";

const PORT = 4000;
const app = express();


app.set("view engine", 'pug');
app.set("views", process.cwd()+"/src/views");
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: 'booyah',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
    store: MongoStore.create({ mongoUrl: 'mongodb://127.0.0.1:27017/memorable-games' })
  }));


app.use(localsMiddlewares);
app.use('/', rootRouter);

app.listen(PORT, ()=>{
    console.log(`😃 Conneted server, PORT: ${PORT}`);
})
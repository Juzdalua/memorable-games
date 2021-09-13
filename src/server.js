import express from "express";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import bodyParser from "body-parser";
import "./db";

const PORT = 4000;
const app = express();


app.set("view engine", 'pug');
app.set("views", process.cwd()+"/src/views");
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', rootRouter);

app.listen(PORT, ()=>{
    console.log(`😃 Conneted server, PORT: ${PORT}`);
})
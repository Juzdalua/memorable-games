import express from "express";

const PORT = 4000;
const app = express();

const handleHome = (req, res) =>{
    res.send("HOME~!");
};

app.get('/', handleHome);

app.listen(PORT, ()=>{
    console.log(`Congaturation to conneted server😃 PORT: ${PORT}`);
})
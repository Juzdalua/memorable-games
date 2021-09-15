import Steam from "../model/Steam";
import User from "../model/User";

export const getSteamList = async (req, res) => {
    const steams = await Steam.find({}).sort({createAt:"desc"}).populate("owner");

    res.render("steam/steam-list", {pageTitle:" | Steam", steams});
};

//게시물 작성
export const getSteamWrite = (req, res) => {

    res.render("steam/steam-write", {pageTitle:" | Steam"});
};
export const postSteamWrite = async (req, res) => {
    const {title, description,age, genre} = req.body;

    const steam = await Steam.create({
        title, description,age, genre,
        owner: req.session.user._id,
        fileUrl: req.file.path        
    });
    const user = await User.findById(req.session.user._id);
    user.steam.push(steam._id);
    user.save();
    
    return res.redirect("/steam");
};

//게시물 클릭
export const getSteam = async (req,res) => {
    const {id} = req.params;
    const steam = await Steam.findById(id).populate("owner");
    res.render("steam/steam", {pageTitle:"Steam", steam});
};
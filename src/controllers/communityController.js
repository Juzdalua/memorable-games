import Community from "../model/Community";
import User from "../model/User";
import Like from "../model/Like";

export const getCommunityList = async (req, res) => {
    const articles = await Community.find({}).populate("owner");
    console.log(articles)
    return res.render("community/community-list", {pageTitle: "Community", articles})
};

//게시물 작성
export const getCommunityWrite = (req, res) => {
    return res.render("community/community-write", {pageTitle:"Community"});
};
export const postCommunityWrite = async(req, res) => {    
    const {title, description} = req.body;
    const loginUser = await User.findById(req.session.user._id);

    const article = await Community.create({
        title, description, 
        fileUrl:req.file.path,
        owner: loginUser._id
    })
    loginUser.community.push(article._id);
    loginUser.save();

     //좋아요&싫어요 달아주기
     const like = await Like.create({
        community: article._id 
     });
     article.like = like._id;
     article.save();

     const comments = "";

    return res.render("community/community-list", {pageTitle:"Community", article, comments});
};
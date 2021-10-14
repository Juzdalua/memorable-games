import Community from "../model/Community";
import User from "../model/User";
import Like from "../model/Like";
import Comment from "../model/Comment";

export const getCommunityList = async (req, res) => {
    const articles = await Community.find({}).populate("owner");
    
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

// 게시물 클릭
export const getCommunity = async(req, res) => {
    const articleId = req.params.id;

    const article = await Community.findById(articleId).populate("owner").populate("like");
    article.views++;
    article.save();
    const comments = await Comment.find({community:articleId}).sort({createAt:"desc"}).populate("owner");

    return res.render("community/community", {pageTitle:"Community", article, comments});
};
import Community from "../model/Community";
import User from "../model/User";
import Like from "../model/Like";
import Dislike from "../model/Dislike";
import Comment from "../model/Comment";

export const getCommunityList = async (req, res) => {
    const articles = await Community.find({}).sort({createAt:"desc"}).populate("owner").populate("like").populate("dislike");
    
    return res.render("community/community-list", {pageTitle: "Community", articles});
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
        owner: loginUser._id
    })
    if(req.file){
        article.fileUrl = req.file.path;        
    }//if

    loginUser.community.push(article._id);
    loginUser.save();

     //좋아요&싫어요 달아주기
     const like = await Like.create({
        community: article._id 
     });
     article.like = like._id;
     
     const dislike = await Dislike.create({
        community: article._id 
     });
     article.dislike = dislike._id;
     article.save();
   
     return res.redirect("/community");
    // return res.render("community/community-list", {pageTitle:"Community", articles});
};

// 게시물 클릭
export const getCommunity = async(req, res) => {
    const articleId = req.params.id;

    const article = await Community.findById(articleId).populate("owner").populate("like").populate("dislike");
    article.views++;
    article.save();
    const comments = await Comment.find({community:articleId}).sort({createAt:"desc"}).populate("owner");

    return res.render("community/community", {pageTitle:"Community", article, comments});
};

// Like & Dislike
export const getArticleLike = async (req, res) => {
    const {id} = req.params;
    const article = await Community.findById(id).populate("owner").populate("like").populate("dislike");
    const user = await User.findById(req.session.user._id);

    //login validation
    if(!req.session.user)
        return res.render("community/community", {pageTitle:"Community", errorMessage:"로그인 먼저 하세요.", article});

    // like/dislike model 찾기
    const like = await Like.findOne({community: id});
    if(!like)
        return res.status(404).render("404");
    const dislike = await Dislike.findOne({community: id});
    if(!dislike)
        return res.status(404).render("404");

    console.log(like.owner, user._id)
    let likeCount = 0;
    let dislikeCount = 0;
    for(let i=0; i<like.owner.length; i++){
        if(String(like.owner[i]) === String(user._id)){
            likeCount = 1;
            break;
        }//if
    }//for
    for(let i=0; i<dislike.owner.length; i++){
        if(String(dislike.owner[i]) === String(user._id)){
            dislikeCount = 1;
            break;
        }//if
    }//for
    
    if(dislikeCount === 0 && likeCount === 0){
        like.like++;
        like.owner.push(user._id);
        user.like.push(like._id);
    } else if(likeCount === 1 && dislikeCount === 0){
        like.like--;
        like.owner = like.owner.filter( x=> String(x) != String(user._id));
        user.like = user.like.filter( x=> String(x) != String(like._id));
    } else if(likeCount === 0 && dislikeCount === 1){
        dislike.dislike--;
        dislike.owner = dislike.owner.filter( x=> String(x) != String(user._id));
        user.dislike = user.dislike.filter( x=> String(x) != String(dislike._id));
    }//if       
    like.save();
    dislike.save();
    user.save();    

    res.redirect('back');
};
export const getArticleDislike = async (req, res) => {
    const {id} = req.params;
    const article = await Community.findById(id).populate("owner").populate("like");
    const user = await User.findById(req.session.user._id);

    //login validation
    if(!req.session.user)
        return res.render("community/community", {pageTitle:"Community", errorMessage:"로그인 먼저 하세요.", article});

    // like/dislike model 찾기
    const like = await Like.findOne({community: id});
    if(!like)
        return res.status(404).render("404");
    const dislike = await Dislike.findOne({community: id});
    if(!dislike)
        return res.status(404).render("404");

    let likeCount = 0;
    let dislikeCount = 0;
    for(let i=0; i<like.owner.length; i++){
        if(String(like.owner[i]) === String(user._id)){
            likeCount = 1;
            break;
        }//if
    }//for
    for(let i=0; i<dislike.owner.length; i++){
        if(String(dislike.owner[i]) === String(user._id)){
            dislikeCount = 1;
            break;
        }//if
    }//for
    
    if(dislikeCount === 0 && likeCount === 0){
        dislike.dislike++;
        dislike.owner.push(user._id);
        user.dislike.push(dislike._id);
    } else if(likeCount === 1 && dislikeCount === 0){
        like.like--;
        like.owner = like.owner.filter( x=> String(x) != String(user._id));
        user.like = user.like.filter( x=> String(x) != String(like._id));          
    } else if(likeCount === 0 && dislikeCount === 1){
        dislike.dislike--;
        dislike.owner = dislike.owner.filter( x=> String(x) != String(user._id));
        user.dislike = user.dislike.filter( x=> String(x) != String(dislike._id));        
    }//if       
    like.save();
    dislike.save();
    user.save();    

    res.redirect('back');
};

//댓글달기
export const createCommentCommunity = async (req, res) => {
    const {
        params:{id},
        body:{comment}
    } = req;
    const article = await Community.findById(id).populate("owner").populate("like").populate("dislike");
    const loginUser = await User.findById(req.session.user._id);
    
    //login validation
    if(!req.session.user)
        return res.render("community/community", {pageTitle:"Game", errorMessage:"로그인 먼저 하세요.", article});

    const newComment = await Comment.create({
        comment, 
        owner: loginUser,
        community:id
    });

    const comments = await Comment.find({community:id}).sort({createdAt:"desc"}).populate("owner");
    
    article.comments.push(newComment);
    article.save();
    
    loginUser.comments.push(newComment);
    loginUser.save();

    return res.render("community/community", {pageTitle:"Community", article, comments});
};

export const deleteCommentCommunity = async (req, res) => {
    const loginUser = req.session.user;    
    //login validation
    if(!loginUser)
        return res.render("community/community", {pageTitle:"Community", errorMessage:"로그인 먼저 하세요.", article});

    const commentId = req.params.id;
    const {article_id} = req.body;
    
    const comment = await Comment.findById(commentId).populate("owner");
    
    if(!comment)
        return res.redirect("back");

    const article = await Community.findById(article_id).populate("comments");
    const user = await User.findById(comment.owner._id).populate("comments");
    
    //user validation
    if(String(user._id) !== String(loginUser._id) )
        return res.status(404).render("404");
    
    await Comment.findByIdAndDelete(commentId);
    article.comments = article.comments.filter(x => String(x._id) != String(commentId));
    article.save();
    user.comments = user.comments.filter(x => String(x._id) != String(commentId));
    user.save();

    const comments = await Comment.find({community:article_id}).sort({createdAt:"desc"}).populate("owner");
    
    return res.render("community/community", {pageTitle:"Community", article, comments});
};
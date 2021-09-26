import Like from "../model/Like";
import Steam from "../model/Steam";
import User from "../model/User";
import Comment from "../model/Comment";


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
    
    //좋아요&싫어요 달아주기
    const like = await Like.create({
       game: steam._id 
    });
    steam.like = like._id;
    steam.save();

    return res.redirect("/steam");
};

//게시물 클릭
export const getSteam = async (req,res) => {
    const {id} = req.params;
    const steam = await Steam.findById(id).populate("owner").populate("like");

    //조회수 늘려주기
    steam.views++;
    steam.save();

    const comments = await Comment.find({game:id}).sort({createdAt:"desc"}).populate("owner");
    
    return res.render("steam/steam", {pageTitle:"Steam", steam, comments});
};

// Like & Dislike
export const getSteamLike = async (req, res) => {
    const {id} = req.params;
    const steam = await Steam.findById(id).populate("owner").populate("like");

    //login validation
    if(!req.session.user)
        return res.render("steam/steam", {pageTitle:"Steam", errorMessage:"로그인 먼저 하세요.", steam});

    // like model 찾기
    const like = await Like.findOne({game: id});
    if(!like)
        return res.status(404).render("404");

    // 좋아요 설정
    let newlike = 0;
    let newdislike = like.dislike;
    if (like.like === 0 && like.dislike === 0){
        newlike = 1;
    }
    else if(like.like === 1 && like.dislike === 0){
        newlike = 0
    }
    else if(like.dislike === 1){
        newlike = 0;
        newdislike = 0;
    }
    await Like.findByIdAndUpdate(
        like._id, {like:newlike, dislike:newdislike}
    );

    //좋아요 유저에 저장
    const user = await User.findById(req.session.user._id);
    if(newlike !== 1){          
        user.like = user.like.filter( x=> String(x) != String(like._id));
        user.save();
    } else{
        user.like.push(like._id);
        user.save();
    }

    res.redirect('back');
};
export const getSteamDislike = async (req, res) => {
    const {id} = req.params;
    const steam = await Steam.findById(id).populate("owner").populate("like");

    //login validation
    if(!req.session.user)
        return res.render("steam/steam", {pageTitle:"Steam", errorMessage:"로그인 먼저 하세요.", steam});

    // like model 찾기
    const like = await Like.findOne({game: id});
    if(!like)
        return res.status(404).render("404");

    // 좋아요 설정
    let newlike = like.like;
    let newdislike = 0;
    if (like.like === 0 && like.dislike === 0){
        newdislike = 1;
    }
    else if(like.like === 0 && like.dislike === 1){
        newdislike = 0
    }
    else if(like.like === 1){
        newlike = 0;
        newdislike = 0;
    }
    await Like.findByIdAndUpdate(
        like._id, {like:newlike, dislike:newdislike}
    );

    //좋아요 없는 유저 빼버리기
    const user = await User.findById(req.session.user._id);
    if(newlike !== 1){          
        user.like = user.like.filter( x=> String(x) != String(like._id));
        user.save();
    } 

    res.redirect('back');
};

//댓글달기
export const createComment = async (req, res) => {
    const {
        params:{id},
        body:{comment}
    } = req;
    const steam = await Steam.findById(id).populate("owner").populate("like");
    const loginUser = await User.findById(req.session.user._id);
    
    //login validation
    if(!req.session.user)
        return res.render("steam/steam", {pageTitle:"Steam", errorMessage:"로그인 먼저 하세요.", steam});

    const newComment = await Comment.create({
        comment, 
        owner: loginUser,
        game:id
    });

    const comments = await Comment.find({game:id}).sort({createdAt:"desc"}).populate("owner");
    
    steam.comments.push(newComment);
    steam.save();
    
    loginUser.comments.push(newComment);
    loginUser.save();

    return res.render("steam/steam", {pageTitle:"Steam", steam, comments});
};

export const deleteComment = async (req, res) => {
    const loginUser = req.session.user;    
    //login validation
    if(!loginUser)
        return res.render("steam/steam", {pageTitle:"Steam", errorMessage:"로그인 먼저 하세요.", steam});

    const commentId = req.params.id;
    const {steam_id} = req.body;
    
    const comment = await Comment.findById(commentId).populate("owner");
    
    if(!comment)
        return res.redirect("back");

    const steam = await Steam.findById(steam_id).populate("comments");
    const user = await User.findById(comment.owner._id).populate("comments");
    
    //user validation
    if(String(user._id) !== String(loginUser._id) )
        return res.status(404).render("404");
    
    await Comment.findByIdAndDelete(commentId);
    steam.comments = steam.comments.filter(x => String(x._id) != String(commentId));
    steam.save();
    user.comments = user.comments.filter(x => String(x._id) != String(commentId));
    user.save();

    const comments = await Comment.find({game:steam_id}).sort({createdAt:"desc"}).populate("owner");
    
    return res.render("steam/steam", {pageTitle:"Steam", steam, comments});
};
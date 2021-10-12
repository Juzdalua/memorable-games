import Like from "../model/Like";
import Game from "../model/Game";
import User from "../model/User";
import Comment from "../model/Comment";
import ffmpeg from "fluent-ffmpeg";


export const getGameList = async (req, res) => {
    const games = await Game.find({}).sort({createAt:"desc"}).populate("owner");

    res.render("games/games-list", {pageTitle:" | Game", games});
};

//게시물 작성
export const getGameWrite = (req, res) => {

    res.render("games/games-write", {pageTitle:" | Game"});
};
export const postGameWrite = async (req, res) => {
    const {title, description,age, genre} = req.body;
               
    const game = await Game.create({
        title, description,age, genre,
        owner: req.session.user._id,
        fileUrl: req.file.path,        
    });    
    const user = await User.findById(req.session.user._id);
    user.game.push(game._id);
    user.save();
    
    //좋아요&싫어요 달아주기
    const like = await Like.create({
       game: game._id 
    });
    game.like = like._id;
    game.save();

    //thumbnail 만들기
    let thumbnailUrl = "";
    ffmpeg(req.file.path)
    .on('filenames', function(filenames) {
        // console.log('Will generate ' + filenames.join(', '));        
        thumbnailUrl = `uploads/thumbnails/${filenames[0]}`        
    })
    .on('end', function() {
        //console.log('Screenshots taken');
        game.thumbnailUrl = thumbnailUrl;
        game.save();
    }).on("error", function(error){
        console.log(error);
        return res.status(404).render("404");
    })
    .screenshots({
        count:1,
        filename: "thumbnail-%b.png",
        folder: `uploads/thumbnails`,
        size: "250x150",             
    });    
    const comments="";
    //return res.redirect("/games");
    return res.render("games/games", {pageTitle:"Game", game, comments});
};

//게시물 클릭
export const getGame = async (req,res) => {
    const {id} = req.params;
    const game = await Game.findById(id).populate("owner").populate("like");

    //조회수 늘려주기
    game.views++;
    game.save();

    const comments = await Comment.find({game:id}).sort({createdAt:"desc"}).populate("owner");
    
    return res.render("games/games", {pageTitle:"Game", game, comments});
};

// Like & Dislike
export const getGameLike = async (req, res) => {
    const {id} = req.params;
    const game = await Game.findById(id).populate("owner").populate("like");

    //login validation
    if(!req.session.user)
        return res.render("games/games", {pageTitle:"Game", errorMessage:"로그인 먼저 하세요.", game});

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
export const getGameDislike = async (req, res) => {
    const {id} = req.params;
    const game = await Game.findById(id).populate("owner").populate("like");

    //login validation
    if(!req.session.user)
        return res.render("games/games", {pageTitle:"Game", errorMessage:"로그인 먼저 하세요.", game});

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
    const game = await Game.findById(id).populate("owner").populate("like");
    const loginUser = await User.findById(req.session.user._id);
    
    //login validation
    if(!req.session.user)
        return res.render("games/games", {pageTitle:"Game", errorMessage:"로그인 먼저 하세요.", game});

    const newComment = await Comment.create({
        comment, 
        owner: loginUser,
        game:id
    });

    const comments = await Comment.find({game:id}).sort({createdAt:"desc"}).populate("owner");
    
    game.comments.push(newComment);
    game.save();
    
    loginUser.comments.push(newComment);
    loginUser.save();

    return res.render("games/games", {pageTitle:"Game", game, comments});
};

export const deleteComment = async (req, res) => {
    const loginUser = req.session.user;    
    //login validation
    if(!loginUser)
        return res.render("games/games", {pageTitle:"Game", errorMessage:"로그인 먼저 하세요.", game});

    const commentId = req.params.id;
    const {game_id} = req.body;
    
    const comment = await Comment.findById(commentId).populate("owner");
    
    if(!comment)
        return res.redirect("back");

    const game = await Game.findById(game_id).populate("comments");
    const user = await User.findById(comment.owner._id).populate("comments");
    
    //user validation
    if(String(user._id) !== String(loginUser._id) )
        return res.status(404).render("404");
    
    await Comment.findByIdAndDelete(commentId);
    game.comments = game.comments.filter(x => String(x._id) != String(commentId));
    game.save();
    user.comments = user.comments.filter(x => String(x._id) != String(commentId));
    user.save();

    const comments = await Comment.find({game:game_id}).sort({createdAt:"desc"}).populate("owner");
    
    return res.render("games/games", {pageTitle:"Game", game, comments});
};
import Like from "../model/Like";
import Dislike from "../model/Dislike";
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
    
    const isHeroku = process.env.NODE_ENV === "production";

    const game = await Game.create({
        title, description,age, genre,
        owner: req.session.user._id,
        fileUrl: isHeroku ? req.file.location : req.file.path,        
    });    
    const user = await User.findById(req.session.user._id);
    user.game.push(game._id);
    user.save();
    
    //좋아요&싫어요 달아주기
    const like = await Like.create({
       game: game._id 
    });
    game.like = like._id;
    const dislike = await Dislike.create({
        game: game._id 
     });
     game.dislike = dislike._id;
    game.save();

    //thumbnail 만들기
    let thumbnailUrl = "";
    ffmpeg(isHeroku ? req.file.location : req.file.path)
    .on('filenames', function(filenames) {
        // console.log('Will generate ' + filenames.join(', '));        
        thumbnailUrl = isHeroku ? `https://memorable-games.s3.ap-northeast-2.amazonaws.com/videos/thumbnails/${filenames[0]}` : `uploads/videos/thumbnails/${filenames[0]}`  
        // thumbnailUrl = `uploads/videos/thumbnails/${filenames[0]}`      
        console.log("1")  
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
        folder: isHeroku ? `https://memorable-games.s3.ap-northeast-2.amazonaws.com/videos/thumbnails` : `uploads/videos/thumbnails`,
        // folder: `uploads/videos/thumbnails`,
        size: "250x150",             
    });    
    const comments="";
    //return res.redirect("/games");
    return res.render("games/games", {pageTitle:"Game", game, comments});
};

//게시물 클릭
export const getGame = async (req,res) => {
    const {id} = req.params;
    const game = await Game.findById(id).populate("owner").populate("like").populate("dislike");

    //조회수 늘려주기
    game.views++;
    game.save();

    const comments = await Comment.find({game:id}).sort({createdAt:"desc"}).populate("owner");
    
    return res.render("games/games", {pageTitle:"Game", game, comments});
};

// Like & Dislike
export const getGameLike = async (req, res) => {
    const {id} = req.params;
    const game = await Game.findById(id).populate("owner").populate("like").populate("dislike");    

    const comments = await Comment.find({game:id}).sort({createdAt:"desc"}).populate("owner");
    //login validation
    if(!req.session.user)
        return res.render("games/games", {pageTitle:"Game", errorMessage:"로그인 먼저 하세요.", game, comments});

    const user = await User.findById(req.session.user._id);

    // like model 찾기
    const like = await Like.findOne({game: id});
    if(!like)
        return res.status(404).render("404");
    const dislike = await Dislike.findOne({game: id});
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
export const getGameDislike = async (req, res) => {
    const {id} = req.params;
    const game = await Game.findById(id).populate("owner").populate("like");    

    const comments = await Comment.find({game:id}).sort({createdAt:"desc"}).populate("owner");
    //login validation
    if(!req.session.user)
        return res.render("games/games", {pageTitle:"Game", errorMessage:"로그인 먼저 하세요.", game, comments});

    const user = await User.findById(req.session.user._id);

    // like model 찾기
    const like = await Like.findOne({game: id});
    if(!like)
        return res.status(404).render("404");
    const dislike = await Dislike.findOne({game: id});
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
export const createComment = async (req, res) => {
    const {
        params:{id},
        body:{comment}
    } = req;
    const game = await Game.findById(id).populate("owner").populate("like");
    const comments = await Comment.find({game:id}).sort({createdAt:"desc"}).populate("owner");

    //login validation
    if(!req.session.user)
        return res.render("games/games", {pageTitle:"Game", errorMessage:"로그인 먼저 하세요.", game, comments});

    const loginUser = await User.findById(req.session.user._id);  

    const newComment = await Comment.create({
        comment, 
        owner: loginUser,
        game:id
    });
    
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
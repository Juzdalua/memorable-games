import mongoose from 'mongoose';
const { Schema } = mongoose;

const CommentSchema = new Schema({     
    comment: {type:String, required:true}, 
    createAt: {type:Date, default:Date.now, required:true},
    owner: {type:mongoose.Schema.Types.ObjectId, ref:"User"},
    game: {type:mongoose.Schema.Types.ObjectId, ref:"Game"},
    community: {type:mongoose.Schema.Types.ObjectId, ref:"Community"}
});



const Comment = mongoose.model("Comment", CommentSchema);
export default Comment;
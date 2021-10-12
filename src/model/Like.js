import mongoose from 'mongoose';
const { Schema } = mongoose;

const LikeSchema = new Schema({     
    like: {type:Number, default:0},
    dislike:{type:Number, default:0},   
    owner: [{type:mongoose.Schema.Types.ObjectId, ref:"User"}],
    game: {type:mongoose.Schema.Types.ObjectId, required:true, ref:"Game"}
});



const Like = mongoose.model("Like", LikeSchema);
export default Like;
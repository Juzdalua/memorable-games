import mongoose from 'mongoose';
const { Schema } = mongoose;

const DislikeSchema = new Schema({     
    dislike: {type:Number, default:0},
    owner: [{type:mongoose.Schema.Types.ObjectId, ref:"User"}],
    game: {type:mongoose.Schema.Types.ObjectId, ref:"Game"},
    community: {type:mongoose.Schema.Types.ObjectId, ref:"Community"}
});



const Dislike = mongoose.model("Dislike", DislikeSchema);
export default Dislike;
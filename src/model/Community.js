import mongoose from 'mongoose';
const { Schema } = mongoose;

const CommunitySchema = new Schema({
    title: {type:String, required:true},
    description: {type:String, required:true},
    createAt:{type:Date, default:Date.now},
    views: {type:Number, default:0}, 
    rating: {type:Number, default:0},
    fileUrl: {type:String},
    owner: {type:mongoose.Schema.Types.ObjectId, required:true, ref:"User"},
    comments: [{type:mongoose.Schema.Types.ObjectId, ref:"Comment"}],
    like: {type:mongoose.Schema.Types.ObjectId, ref:"Like"},
    dislike: {type:mongoose.Schema.Types.ObjectId, ref:"Dislike"}
});

const Community = mongoose.model("Community", CommunitySchema);
export default Community;
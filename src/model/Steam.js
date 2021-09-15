import mongoose from 'mongoose';
const { Schema } = mongoose;

const SteamSchema = new Schema({     
    title: {type:String, required:true},
    description: {type:String, required:true},
    createAt:{type:Date, default:Date.now},
    genre: {type:String, required:true},
    age:{type:Number, required:true},
    views: {type:Number, default:0}, 
    rating: {type:Number, default:0},
    fileUrl: {type:String, required:true},
    owner: {type:mongoose.Schema.Types.ObjectId, required:true, ref:"User"},
    comments: [{type:mongoose.Schema.Types.ObjectId, ref:"Comment"}]
});



const Steam = mongoose.model("Steam", SteamSchema);
export default Steam;
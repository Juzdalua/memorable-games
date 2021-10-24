import mongoose from 'mongoose';
const { Schema } = mongoose;

const NoticeSchema = new Schema({  
    idx:{type:Number, required:true, unique:true},
    title: {type:String, required:true},
    description: {type:String, required:true},
    createAt:{type:Date, default:Date.now},
    views: {type:Number, default:0}, 
    owner: {type:mongoose.Schema.Types.ObjectId, required:true, ref:"User"},
});



const Notice = mongoose.model("Notice", NoticeSchema);
export default Notice;
import mongoose from 'mongoose';
const { Schema } = mongoose;

const NoticeCounterSchema = new Schema({    
    name:{type:String, required:true},
    index: {type:Number, default:0}      
});



const NoticeCounter = mongoose.model("NoticeCounter", NoticeCounterSchema);
export default NoticeCounter;
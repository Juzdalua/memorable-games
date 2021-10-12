import mongoose from 'mongoose';
const { Schema } = mongoose;

const UserSchema = new Schema({
    userid: {type:String, required:true, unique:true},
    password: {type:String, required:true},
    email: {type:String, required:true, unique:true},
    grade: {type:Number, required:true, default:2}, //0-master 1-sec_master 2-nomal
    notice:[ {type:mongoose.Schema.Types.ObjectId, ref:"Notice"} ],
    game:[ {type:mongoose.Schema.Types.ObjectId, ref:"Game"} ],
    like:[ {type:mongoose.Schema.Types.ObjectId, ref:"Like"} ],
    comments: [{type:mongoose.Schema.Types.ObjectId, ref:"Comment"}],
});


const User = mongoose.model("User", UserSchema);
export default User;
import mongoose from 'mongoose';
const { Schema } = mongoose;

const UserSchema = new Schema({
    userid: {type:String, required:true, unique:true},
    password: {type:String, required:true},
    email: {type:String, required:true, unique:true}
});


const User = mongoose.model("User", UserSchema);
export default User;
import mongoose from 'mongoose';
const { Schema } = mongoose;

const GameSchema = new Schema({     
    title: {type:String, required:true},
    description: {type:String, required:true},
    createAt:{type:Date, default:Date.now},
    genre: {type:Number, required:true}, // 0-액션, 1-RPG, 2-퍼즐, 3-어드벤쳐, 4-시뮬레이션, 5-음악, 6-스포츠, 7-아케이드
    age:{type:Number, required:true},   // 0-전체이용가, 1-12세이용가, 2-15세이용가, 3-청소년이용불가, 4-시험용, 5-등급면제
    views: {type:Number, default:0}, 
    rating: {type:Number, default:0},
    fileUrl: {type:String, required:true},
    thumbnailUrl: {type:String},
    owner: {type:mongoose.Schema.Types.ObjectId, required:true, ref:"User"},
    comments: [{type:mongoose.Schema.Types.ObjectId, ref:"Comment"}],
    like: {type:mongoose.Schema.Types.ObjectId, ref:"Like"}
});



const Game = mongoose.model("Game", GameSchema);
export default Game;
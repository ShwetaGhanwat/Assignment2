const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const ObjectId=Schema.ObjectId;
mongoose.pluralize(null);
const User=require('./User')

const postSchema=new mongoose.Schema({
    title:{type:String,required:true,unique:true},
    body: {type:String,required:true},
    image:{type:String,required:true},
    user:{type:ObjectId,ref:'User'}
});

const Post=mongoose.model('post',postSchema);

module.exports=Post;
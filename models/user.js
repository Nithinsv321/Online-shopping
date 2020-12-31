const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        unique:true,
        required:true,
        trim:true
    },
    phone:{
        type:String,
        required:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
        trim:true
    }
});
userSchema.pre('save',async function(next){
    if(this.password){
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password,salt);
    }
    next();
});

const user = mongoose.model('user',userSchema);
module.exports = user;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
    admin_name:{
        type:String,
        required:true,
        trim:true,
    },
    admin_email:{
        type:String,
        required:true,
        trim:true
    },
    admin_phone:{
        type:Number,
        required:true,
        trim:true,
    },
    admin_password:{
        type:String,
        required:true,
        trim:true,
    }
});

adminSchema.pre('save',async function(next){
    if(this.admin_password){
        const salt = await bcrypt.genSalt(12);
        this.admin_password = await bcrypt.hash(this.admin_password,salt);
    }
    next();
});

const admin = mongoose.model('Admin',adminSchema);

module.exports =admin;
const mongoose = require('mongoose');

const userDetailSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        trim:true,
    },
    name:{
        type:String,
        required:true,
        trim:true
    },
    dob:{
        type:Date,
        required:true,
        trim:true
    },
    mailid:{
        type:String,
        required:true,
        trim:true
    },
    address:{
        houseName:{
            type:String,
            required:true,
            trim:true
        },
        city:{
            type:String,
            required:true,
            trim:true
        },
        pincode:{
            type:String,
            required:true,
            trim:true
        },
        state:{
            type:String,
            required:true,
            trim:true
        },
        country:{
            type:String,
            required:true,
            trim:true
        },
    }
    
});

const userDetails = mongoose.model('userDetails',userDetailSchema);


module.exports = userDetails;
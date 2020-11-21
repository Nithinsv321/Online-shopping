const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    admin:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        trim:true
    },
    name:{
        type:String,
        required:true,
        trim:true,
    },
    type:{
        type:String,
        required:true,
        
    },
    category:{
        type:String,
        required:true,
        trim:true,
    },
    brand:{
        type:String,
        required:true,
        trim:true,
    },
    model:{
        type:String,
        unique:true,
        required:true,
        trim:true,

    },
    price:{
        type:Number,
        required:true,
        trim:true,
    },
    quantity:{
        type:Number,
        required:true,
        trim:true,
    },
});

const product = mongoose.model('product',productSchema);


module.exports = product;
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        trim:true
    },
    details:{
        name:{
            type:String,
            required:true,
            trim:true
        },
        houseName:{
            type:String,
            required:true,
            trim:true
        },
        zip:{
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
    },
    product:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        trim:true
    },
    quantity:{
        type:Number,
        required:true,
        trim:true
    },
    payment:{
        type:String,
        required:true,
        trim:true,
    },
    status:{
        type:Boolean,
        trim:true,
        default:false,
    }
});

const orders = mongoose.model('orders',orderSchema);

module.exports = orders;

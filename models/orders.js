const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        trim:true
    },
    product:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        trim:true
    },
    quantity:{
        type:Number,
        required:true,
        default: 1,
        trim:true

    }
});

const orders = mongoose.model('orders',orderSchema);

module.exports = orders;

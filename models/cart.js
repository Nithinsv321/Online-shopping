const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        trim:true,
    },
    product:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        trim:true
    }
});

const cart = mongoose.model('cart',cartSchema);


module.exports = cart;
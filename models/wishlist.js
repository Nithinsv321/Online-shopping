const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        trim:true
    },
    product:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        trim:true
    }
});

const wishlist = mongoose.model('wishlist',wishlistSchema);

module.exports = wishlist;

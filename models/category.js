const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    admin:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        trim:true
    },
    category:{
        type:String,
        required:true,
        trim:true
    }
});

const category = mongoose.model('category',categorySchema);

module.exports = category;


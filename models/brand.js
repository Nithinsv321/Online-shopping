const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
    admin:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        trim:true
    },
    brand:{
        type:String,
        required:true,
        trim:true
    }
});

const brand = mongoose.model('Brand',brandSchema);

module.exports = brand;
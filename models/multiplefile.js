const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const multipleFileSchema = new Schema({

    _id:{
    type:String
    },
    hotelname:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    desc:{
        type:String,
        required:true,
        min:3
    },
    rating:{
        type:Number,
        min:0,
        max:5
    },
    price:{
        type:Number,
        required:true
    },
    files:[Object]
});

module.exports = mongoose.model('roomInfo', multipleFileSchema);
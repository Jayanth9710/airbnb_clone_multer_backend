const mongoose = require('mongoose')
const RoomSchema = new mongoose.Schema(
    {
        hotelname:{
            type:String,
            require:true,
        },
        location:{
            type:String,
            require:true,
        },
        desc:{
            type:String,
            require:true,
            min:3
        },
        rating:{
            type:Number,
            min:0,
            max:5,
        },
        price:{
            type:Number,
            require:true,
            max:100000000,
        },
        isbooked:{
            type:Boolean,
            default:false
        },
        startdate:{
            type:String,
        },
        enddate:{
            type:String,
        }

},
);

module.exports = mongoose.model("Room",RoomSchema)
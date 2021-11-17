const mongoose = require('mongoose')
const BookedRoomSchema = new mongoose.Schema(
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
        Numberofdays:{
            type:Number,
            min:0,
        },
        total:{
            type:Number,
            require:true,
            max:100000000,
        }

},
);

module.exports = mongoose.model("bookedRooms",BookedRoomSchema)
const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        require:true,
        unique:true,
        min:3,
        max:20,
    },
    email:{
        type:String,
        unique:true,
        max:50,
        index:true,
        sparse:true
    },
    password:{
        type:String,
        require:true,
        min:6
    },

},

);

module.exports = mongoose.model("airbnb_users",UserSchema)
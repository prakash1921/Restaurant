var mongoose = require('mongoose')

const UserSchema  = new mongoose.Schema({
    Rid: {
        type:Number,
        default:0
    },
    password: {
        type:String,
        default:''
    },
    name: {
        type:String,
        default:''
    },
    location: {
        type:String,
        default:''
    },
    address:{
        type:String,
        default:''
    },
    zip: {
        type:Number,
        default:0
    },
    cuisines: {
        type:String,
        default:''
    },

})

const User = mongoose.model('newrestaurant', UserSchema)

module.exports = User;
var mongoose = require('mongoose')

const RestaurantSchema = new mongoose.Schema({
    Rid: {
        type: Number,
        default: 0
    },
    password: {
        type: String,
        default: ''
    },
    name: {
        type: String,
        default: ''
    },
    rating: {
        type: Number
    },
    // location: {
    //     type:String,
    //     default:''
    // },
    locationName: {
        type: String,
        default: ''
    },
    location: {
        type: { type: String },
        coordinates: [Number],
    },

    address: {
        type: String,
        default: ''
    },
    zip: {
        type: Number,
        default: 0
    },
    cuisines: {
        type: String,
        default: ''
    },
    menuList: [{
        menuname: String,
        cost: Number

    }]
})
RestaurantSchema.index({ 'location': "2dsphere" });

const restaurant = mongoose.model('restaurant', RestaurantSchema)



// const RestaurantlocationSchema  = new mongoose.Schema({
//     id:Number,
//     restaurant_name:String,
//     phone:Number,
//     address:String,
//     location:{
//         type:{type:String},
//         coordinates:[Number],
//     }

// })
// RestaurantlocationSchema.index({ location: "2dsphere"});
// const Restaurantlocation = mongoose.model('newdata', RestaurantlocationSchema)


module.exports = restaurant;
var mongoose = require('mongoose');
mongoose.Promise = global.Promise

var reviewSchema = new mongoose.Schema({
    rating:{
        type: Number,
        min: 0.0,
        max: 10.0,
        required: true
    },
    title:{
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    comment:{
        type: String,
        required: true
    }
});

var apartmentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    bathrooms: {
        type: Number,
        min: 1,
        required: true
    },
    bedrooms: {
        type: Number,
        min: 1,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    amenities: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    time: String,
    reviews: [reviewSchema]
});


var Apartment = mongoose.model('Apartment', apartmentSchema);
module.exports = Apartment;
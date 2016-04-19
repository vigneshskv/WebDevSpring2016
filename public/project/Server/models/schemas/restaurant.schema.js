"use strict";
module.exports = function(mongoose) {
    var breBookSchema =  mongoose.Schema({
            ISBN_13             : String,
            title               : String,
            thumbnailUrl        : {type: String, default : "//placehold.it/100x100"},
            description         : String,
            yelpPreviewLink   : String,
            breViewRating   : {type: Number, max: 5 , default: 5},
            sentimentRating : String
        },
        {collection: "urbanappetizer.project.restaurants"});

    return breBookSchema;
};
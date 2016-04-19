"use strict";
module.exports = function(mongoose) {
    var uaRestaurantFavSchema =  mongoose.Schema({
            userId          : String,
            bookIds          : [String]
        },
        {collection: "urbanappetizer.project.favorite"});

    return uaRestaurantFavSchema;
};
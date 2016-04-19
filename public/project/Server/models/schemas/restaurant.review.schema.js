"use strict";
module.exports = function(mongoose) {
    var uaRestaurantReviewSchema =  mongoose.Schema({
            bookId          : String,
            userId          : String,
            username        : String,
            reviewDesc      : String,
            reviewDate      : {type : Date,  default: Date.now},
        },
        {collection: "urbanappetizer.project.reviews"});

    return uaRestaurantReviewSchema;
};
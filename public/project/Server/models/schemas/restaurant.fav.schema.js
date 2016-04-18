"use strict";
module.exports = function(mongoose) {
    var breBookFavSchema =  mongoose.Schema({
            userId          : String,
            bookIds          : [String]
        },
        {collection: "urbanappetizer.project.favorite"});

    return breBookFavSchema;
};
"use strict";
module.exports = function(mongoose) {
    var breBookSchema =  mongoose.Schema({
            ISBN_13             : String,
            title               : String,
            //authors              : [String],
            thumbnailUrl        : {type: String, default : "//placehold.it/100x100"},
            description         : String,
            googlePreviewLink   : String,


            // overall breview rating for the book
            breViewRating   : {type: Number, max: 5 , default: 5},
            // overall breview  Sentiment rating for the book
            sentimentRating : String
        },
        {collection: "bukreview.test4.book"});

    return breBookSchema;
};
"use strict";
module.exports = function(mongoose) {

    var userSchema =  mongoose.Schema({
            firstName       : String,
            lastName        : String,
            username        : String,
            password        : String,
            email           : String,
            joinDate        : {type : Date,  default: Date.now},
            profilePicUrl   : {type: String, default : "//placehold.it/100x100"}
        },
        {collection: "urbanappetizer.project.users"});

    return userSchema;
};
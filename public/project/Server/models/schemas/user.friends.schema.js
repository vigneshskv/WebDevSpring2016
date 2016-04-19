"use strict";
module.exports = function(mongoose) {

    var userFriends = mongoose.Schema({
            userId      :  String,
            friends     : [String],
            followers   : [String]
        },
        {collection: "urbanappetizer.project.friends"});

    return userFriends;
};
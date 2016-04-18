"use strict";
module.exports = function(mongoose) {

    var userFriends = mongoose.Schema({
            userId      :  String,
            friends     : [String],
            followers   : [String]
            /*friends     : {type: [String], unique : true},
            followers   : {type: [String], unique : true}*/

            /*friends     : {type: [String], unique: true},
            followers   : {type: [String], unique: true}*/
        },
        {collection: "urbanappetizer.project.friends"});

    return userFriends;
};
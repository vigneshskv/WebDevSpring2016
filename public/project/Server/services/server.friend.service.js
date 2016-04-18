"use strict";
module.exports = function(app, model, mongoose, passport) {

    var LocalStrategy = require('passport-local').Strategy;

    app.post("/api/friend/:userId/:friendId", AddFriendForUserId);
    app.get("/api/friends/:userId", FindFriendsAndFollowersForId);
    app.delete("/api/friend/:userId/:friendId", RemoveFriendOrFollower);


    function AddFriendForUserId(req, res) {
        var userId = req.params.userId;
        var friendId = req.params.friendId;
        model.AddFriendForUserId(userId, friendId)
            .then(function (userFriendObj) {
                res.json(userFriendObj);
            });
    }


    function RemoveFriendOrFollower(req, res) {
        model.RemoveFriendorFollower(req.params.userId, req.params.friendId)
            .then(function (userFriendFollowerObj) {
                res.json(userFriendFollowerObj);
            });
    }


    function FindFriendsAndFollowersForId(req, res) {
        model.findFriendsAndFollowersForId(req.params.userId)
            .then(function (userFriendFollowerObj) {
                res.json(userFriendFollowerObj);
            });
    }
};
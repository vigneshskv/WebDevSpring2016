"use strict";
(function(){
    angular
        .module("UrbanAppetizerApp")
        .factory("ClientFriendService",ClientFriendService);

    function ClientFriendService($rootScope, $http, $q) {
        var service = {
            // function for connecting users
            AddFriendForUserId              : AddFriendForUserId,
            findFriendsAndFollowersForId    : findFriendsAndFollowersForId,
            removeFriendorFollower          : removeFriendorFollower
    };
    return service;

        function AddFriendForUserId(userId, friendId){
            var deffered = $q.defer();
            $http.post("/api/friend/"+userId+"/"+friendId)
                .success(function(userFriendObj){
                    deffered.resolve(userFriendObj);
                });
            return deffered.promise;
        }

        function findFriendsAndFollowersForId(userId){
            var deferred = $q.defer();
            $http.get("/api/friends/"+userId)
                .success(function (friendsFollowersObj) {
                    deferred.resolve(friendsFollowersObj);
                });
            return deferred.promise;
        }

        function removeFriendorFollower(userId, friendId){
            var deferred = $q.defer();
            $http.delete("/api/friend/"+userId+"/"+friendId)
                .success(function (userObj){
                    deferred.resolve(userObj);
                });
            return deferred.promise;
        }
    }
})();
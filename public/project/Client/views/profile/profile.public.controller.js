"use strict";
(function(){
    angular
        .module("UrbanAppetizerApp")
        .controller("ProfilePublicController",ProfilePublicController);


    function ProfilePublicController($location,ClientUserService,$rootScope, $window, ClientFavouriteService){
        var model = this;

        model.GetReviewsByCurrentUser = GetReviewsByCurrentUser;
        model.isCurrentUser           = isCurrentUser;

        model.user = $rootScope.visitFriend;
        model.user = JSON.parse($window.sessionStorage.getItem("visitFriend"));

        console.log(model.user);
        GetReviewsByCurrentUser(model.user._id);
        function GetReviewsByCurrentUser(userId) {
            ClientFavouriteService.GetReviewsByUserId(userId)
                .then(function(userRevBooks){
                    if((userRevBooks != null)){
                        renderReviews(userRevBooks);
                    }else{
                        model.noBookMsg = model.user.username+ " has not reviewed restuarants yet!";
                    }
                });
        }

        function isCurrentUser(username){
            if($rootScope.user.username == username)
                return true;

            return false;
        }

        function renderReviews(userReviews){
            //console.log(userReviews);
            model.reviewBooks = userReviews;
            //console.log(model.reviewBooks);
        }
    }
})();
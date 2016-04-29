"use strict";
(function(){
    angular
        .module("UrbanAppetizerApp")
        .controller("FavReviewController",FavReviewController);


    function FavReviewController($http, $window ,$location, $rootScope, ClientUserService, ClientSearchService, ClientFavouriteService) {
        var model = this;

        model.GetReviewsByCurrentUser = GetReviewsByCurrentUser;
        model.isCurrentUser           = isCurrentUser;
        model.getRestaurantDetails    = getRestaurantDetails;


        GetReviewsByCurrentUser($rootScope.user._id);
        function GetReviewsByCurrentUser(userId) {
            ClientFavouriteService.GetReviewsByUserId(userId)
                .then(function(userRevBooks){
                    if(userRevBooks != null){
                            renderReviews(userRevBooks);
                    }else{
                        model.noRestaurantMsg = "You have not reviewed restaurants yet!";
                    }
                });
        }

        function isCurrentUser(username){
            if($rootScope.user)
                if ($rootScope.user.username == username)
                    return true;

            return false;
        }

        function renderReviews(userReviews){
            //console.log(userReviews);
            model.reviewRestaurants = userReviews;
        }


        function getRestaurantDetails(book){
            var bookObj;
            ClientFavouriteService.GetRestaurantDetailsById(book.id)
                .then(function(bookObjRes){

                    $window.sessionStorage.setItem("currentRestaurant",angular.toJson(bookObjRes));
                    $location.url("/restaurantdetail");
                });
        }
    }
})();
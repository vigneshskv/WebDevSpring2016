"use strict";
(function(){
    angular
        .module("UrbanAppetizerApp")
        .controller("FavFavController",FavFavController);


    function FavFavController($window ,$location, $rootScope, ClientUserService, ClientSearchService, ClientFavouriteService) {
        var model = this;

        model.GetFavBooksForCurrentUser = GetFavBooksForCurrentUser;
        model.getRestaurantDetails      = getRestaurantDetails;
        model.removeFav                 = removeFav;


        GetFavBooksForCurrentUser();


        function GetFavBooksForCurrentUser() {
            ClientFavouriteService.GetFavRestaurantsForCurrentUser($rootScope.user._id)
                .then(function(userFavRestaurants){
                        if(userFavRestaurants != null){
                            /*console.log("userFavBooks");
                            console.log(userFavBooks);*/
                            model.favrestaurants = userFavRestaurants;
                        }else{
                            model.favrestaurants = null;
                            model.noRestaurantMsg = "You don't have any favorite restaurant yet!";
                        }
                    });
        }


        function removeFav(favrestaurant){
            ClientFavouriteService.RemoveFavRestaurantForCurrentUser(favrestaurant.ISBN_13, $rootScope.user._id)
                .then(function(userFavRestaurants){
                    model.message = "Restaurant successfully removed from favourite list";
                    GetFavBooksForCurrentUser();
                },
                    function (error){
                        model.error = "Failed to remove the Restaurant from favorite list";
                    }
                );
        }


        function getRestaurantDetails(restaurant){
            console.log(restaurant);

            ClientFavouriteService.GetRestaurantDetailsById(restaurant.ISBN_13)
                .then(function(bookObjRes){
                    console.log(bookObjRes);
                    $window.sessionStorage.setItem("currentRestaurant",angular.toJson(bookObjRes));
                    $location.url("/restaurantdetail");
                });
        }
    }
})();
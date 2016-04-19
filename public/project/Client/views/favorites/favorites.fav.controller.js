"use strict";
(function(){
    angular
        .module("UrbanAppetizerApp")
        .controller("FavFavController",FavFavController);


    function FavFavController($window ,$location, $rootScope, ClientUserService, ClientSearchService, ClientFavouriteService) {
        var model = this;

        model.GetFavBooksForCurrentUser = GetFavBooksForCurrentUser;
        model.getRestaurantDetails            = getRestaurantDetails;
        model.removeFav                 = removeFav;


        GetFavBooksForCurrentUser();
        function GetFavBooksForCurrentUser() {
            ClientFavouriteService.GetFavRestaurantsForCurrentUser($rootScope.user._id)
                .then(function(userFavBooks){
                        if(userFavBooks != null){
                            console.log("userFavBooks");
                            console.log(userFavBooks);
                            model.favbooks = userFavBooks;
                        }else{
                            model.favbooks = null;
                            model.noBookMsg = "You don't have any favorite restaurant yet!";
                        }
                    });
        }


        function removeFav(favbook){
            //console.log("you chose to unfavorite :"+favbook.title);
            //console.log(favbook);
            ClientFavouriteService.RemoveFavRestaurantForCurrentUser(favbook.ISBN_13, $rootScope.user._id)
                .then(function(userFavBooks){
                    model.message = "Restaurant successfully removed from favourite list";
                    GetFavBooksForCurrentUser();
                },
                    function (error){
                        model.error = "Failed to remove the Restaurant from favorite list";
                    }
                );
        }


        function getRestaurantDetails(book){
            console.log(book);

            ClientFavouriteService.GetRestaurantDetailsById(book.ISBN_13)
                .then(function(bookObjRes){
                    console.log(bookObjRes);
                    $window.sessionStorage.setItem("currentBook",angular.toJson(bookObjRes));
                    $location.url("/restaurantdetail");
                });
        }
    }
})();
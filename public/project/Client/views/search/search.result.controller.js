"use strict";
(function(){
    angular
        .module("UrbanAppetizerApp")//,['ui.bootstrap'])
        .controller("SearchResultController",SearchResultController);


    function SearchResultController($window,$rootScope, $location, ClientSearchService,
                                     ClientUserService, ClientFavouriteService){

        var model = this;

        model.searchQuery           = searchQuery;
        model.addFav                = addFav;
        model.isLogin               = isLogin;
        model.getBookDetails        = getBookDetails;
        model.hideAlert             = hideAlert;
        model.getFavButtonColor     = getFavButtonColor;
        model.getFavButtonState     = getFavButtonState;


        var userFavBookIds = [];

        //retrieves favoriote restuarants for logged in user
        function getFavBooksForCurrentUser() {
            if ($rootScope.user != null) {
                ClientFavouriteService.GetFavRestaurantsForCurrentUser($rootScope.user._id)
                    .then(function (userFavBooks) {
                        getBookIds(userFavBooks);
                    });
            }
        }

        function getBookIds(bookFavObj){
            userFavBookIds = [];
            //console.log(bookFavObj);
            if(bookFavObj != null) {
                for (var i = 0; i < bookFavObj.length; i++) {
                    if (userFavBookIds.indexOf(bookFavObj[i].ISBN_13) == -1) {
                        userFavBookIds.push(bookFavObj[i].ISBN_13);
                    }
                }
            }
            //console.log(userFavBookIds);
        }

        function getFavButtonState(book){
            if(userFavBookIds.indexOf(book.id) == -1){
                //console.log("setting state auto");
                return "auto";
            }
            //console.log("setting state none");
            return "none";
        }

        function getFavButtonColor(book){
            if(userFavBookIds.indexOf(book.id) == -1){
                //console.log("setting color red");
                return "red";
            }
            //console.log("setting color Grey");
            return "blue";
        }

        model.searchQueryString = $window.sessionStorage.searchQueryString;
        model.searchLocationString = $window.sessionStorage.searchLocationString;


        searchForQuery();
        function searchForQuery() {
            if (!angular.isUndefined(model.searchQueryString)
                && !angular.isUndefined(model.searchLocationString)) {
                model.addFavMsg = null;
                searchQuery(model.searchQueryString, model.searchLocationString);
            } else {
                //searchQuery("Godfather");
                $location.url("/homecc");
            }
        }


        function hideAlert(){
            model.addFavMsg = null;
        }

        function getBookDetails(book){
            //console.log(book);
            $rootScope.book = book;
            $window.sessionStorage.setItem("currentBook",angular.toJson(book));

            $location.url("/restaurantdetail");
        }

        function searchQuery(searchQueryString, searchLocationString) {
            //console.log("func called");
            //console.log(searchQueryString);
            if(!angular.isUndefined(searchQueryString) && !angular.isUndefined(searchLocationString)){
                //ClientSearchService.searchGoogleBooks(searchQueryString)
                ClientSearchService.findRestuarantByTitle(searchQueryString, searchLocationString)
                .then(function (searchResult) {
                        /*if(searchResult == 400  ){
                            model.fav_class = "alert-warning";
                            model.addFavMsg = "Oops! we could not find the book you were looking for. Please try again";
                        }
                    else{*/
                            getFavBooksForCurrentUser();
                            model.bookResults = searchResult.items;
                        //}
                },function(err){
                    model.fav_class = "alert-warning";
                    model.addFavMsg = "Oops! we could not find the Restaurant you were looking for. Please try again";
                });
            }
        }

        function addFav(restaurant){
            console.log(restaurant);
            ClientFavouriteService.addFavRestaurantForUser($rootScope.user._id,restaurant)
                .then(function (favAddResult){
                    if(favAddResult != null) {
                        model.fav_class = "alert-success";
                        model.addFavMsg = "\""+restaurant.name+ "\"" + " was added to your Favorites";
                        $window.scrollTo(0,0)
                        //searchQuery(model.searchQueryString);
                        getFavBooksForCurrentUser();
                    }else{
                        model.fav_class = "alert-warning";
                        model.addFavMsg = "You have already added this restaurant as your favorites";
                        $window.scrollTo(0,0)
                    }
                });
        }


        function isLogin(){
            if($rootScope.user == null)
                return true;
            else{
                var loggedInUser = $rootScope.user.username;
                model.username = loggedInUser[0].toUpperCase() + loggedInUser.slice(1);
            }
        }
    }
})();
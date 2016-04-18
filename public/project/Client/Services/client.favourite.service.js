"use strict";
(function(){
    angular
        .module("UrbanAppetizerApp")
        .factory("ClientFavouriteService",ClientFavouriteService);

    function ClientFavouriteService($rootScope, $http, $q) {
        var service = {

            //User Restaurant Functions
            addFavRestaurantForUser               : addFavoriteRestaurantForUser,
            RemoveFavRestaurantForCurrentUser     : RemoveFavRestaurantForCurrentUser,
            GetFavRestaurantsForCurrentUser       : GetFavRestaurantsForCurrentUser,
            submitReview                    : submitReview,
            getReviewsForRestaurantID           : getReviewsForRestaurantID,
            GetReviewsByUserId              : GetReviewsByUserId,
            processReviews                  : processReviews,
            GetRestaurantDetailsById              : GetRestaurantDetailsById
        };
        return service;

        function addFavoriteRestaurantForUser(userId,book){
            var deferred = $q.defer();
            $http.post("/api/restaurantfav/"+userId, book)
                .success(function (userFavObj) {
                    deferred.resolve(userFavObj);
                });
            return deferred.promise;
        }

        function RemoveFavRestaurantForCurrentUser(restaurantId, userId){
            var deferred = $q.defer();
            $http.delete("/api/restaurantfav/"+userId+"/"+restaurantId)
                .success(function (userFavs){
                    deferred.resolve(userFavs);
                });
            return deferred.promise;
        }

        function GetFavRestaurantsForCurrentUser(userId){
            var deferred = $q.defer();
            $http.get("/api/restaurantfavs/"+userId)
                .success(function (userFavs){
                    deferred.resolve(userFavs);
                });
            return deferred.promise;
        }

        function submitReview(book, user, userReview){
            var reviewObj = { review    : userReview,
                username  : user.username,
                //centScore : centScore,
                bookObj   : book };
            var deferred = $q.defer();
            $http.post("/api/restaurantReview/"+ user._id, reviewObj)
                .success(function (reviewRes){
                    deferred.resolve(reviewRes);
                });
            return deferred.promise;
        }

        function getReviewsForRestaurantID(restaurantID){
            var deferred = $q.defer();
            $http.get("/api/restaurantreviews/"+restaurantID)
                .success(function(bookReviews){
                    deferred.resolve(bookReviews);
                });
            return deferred.promise;
        }

        function GetReviewsByUserId(userId){
            var deferred = $q.defer();

            $http.get("/api/userReviews/"+userId)
                .success(function(userReviews){
                    var processedReviews;
                    if((userReviews.reviews.length > 0)
                        && (userReviews.bookDetails.length > 0)){
                        processedReviews  = processReviews(userReviews);
                        deferred.resolve(processedReviews);
                    }
                    deferred.resolve(null);
                });
            return deferred.promise;
        }

        function processReviews(userRevRestaurants){
            var restuarants = userRevRestaurants.bookDetails;
            var userReviews = userRevRestaurants.reviews;
            var restuarantsReview = [];
            for(var i=0; i<restuarants.length; i++){
                var resReviewObj = {};
                resReviewObj.id                = restuarants[i].ISBN_13;
                resReviewObj.title             = restuarants[i].title;
                resReviewObj.googlePreviewLink = restuarants[i].googlePreviewLink;
                resReviewObj.sentimentRating   = restuarants[i].sentimentRating;
                resReviewObj.thumbnailUrl      = restuarants[i].thumbnailUrl;
                resReviewObj.reviews           = [];
                for(var j=0; j<userReviews.length; j++){
                    if(userReviews[j].bookId == restuarants[i].ISBN_13){
                        var userReviewObj = {};
                        userReviewObj.reviewDesc        = userReviews[j].reviewDesc;
                        userReviewObj.sentimentRating   = userReviews[j].sentimentRating;
                        userReviewObj.date              = userReviews[j].reviewDate;
                        userReviewObj.username          = userReviews[j].username;

                        resReviewObj.reviews.push(userReviewObj);
                    }
                }
                restuarantsReview.push(resReviewObj);
            }
            return restuarantsReview;
        }

        function GetRestaurantDetailsById(bookId) {
            var deferred = $q.defer();
            $http.get("/api/restaurantdetails/" + bookId)
                .success(function (bookObjRes) {
                    var bookObj = getRestaurantDetails(bookObjRes)
                    deferred.resolve(bookObj);
                });
            return deferred.promise;
        }



    }
})();

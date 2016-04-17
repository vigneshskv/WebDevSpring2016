"use strict";
(function(){
    angular
        .module("UrbanAppetizerApp")
        .factory("ClientUserService",ClientUserService);

    function ClientUserService($rootScope, $http, $q) {
        var service = {
            createUser                      : createUser,
            findUserById                    : findUserById,
            findUserByUserName              : findUserByUserName,
            findUserByUsernameAndPassword   : findUserByUsernameAndPassword,
            findAllUsers                    : findAllUsers,
            deleteUserById                  : deleteUserById,
            updateUser                      : updateUser,
            LoginUser                       : LoginUser,
            LogOutUser                      : LogOutUser,

            // USER FRIEND FUNCTIONS
            AddFriendForUserId              : AddFriendForUserId,
            findFriendsAndFollowersForId    : findFriendsAndFollowersForId,
            removeFriendorFollower          : removeFriendorFollower,

            //User Restaurant Functions
            addFavBookForUser               : addFavoriteRestaurantForUser,
            RemoveFavBookForCurrentUser     : RemoveFavRestaurantForCurrentUser,
            GetFavBooksForCurrentUser       : GetFavRestaurantForCurrentUser,
            submitReview                    : submitReview,
            getReviewsForBookISBN           : getReviewsForRestaurantID,
            GetReviewsByUserId              : GetReviewsByUserId,
            processReviews                  : processReviews,
            GetBookDetailsById              : GetRestaurantDetailsById
        };
        return service;


        function createUser(user) {
            var deferred = $q.defer();
            console.log("Client user Service : Create adding user:");
            console.log(user);
            $http.post("/rest/api/user", user)
                .success(function (user) {
                    deferred.resolve(user);
                });
            return deferred.promise;
        }


        function findUserById(userId) {
            var deferred = $q.defer();
            $http.get("/rest/api/user/" + userId)
                .success(function (userResponse) {
                    deferred.resolve(userResponse);
                });
            return deferred.promise;
        }


        function findUserByUserName(username) {
            var deferred = $q.defer();
            $http.get("/rest/api/user?username="+username)
                .success(function (userResponse) {
                    deferred.resolve(userResponse);
                });
            return deferred.promise;
        }

        function findUserByUsernameAndPassword(user) {
            var deferred = $q.defer();
            $http.get("/rest/api/user?username=" + user.username + "&password=" + user.password)
                .success(function (userResponse) {
                    deferred.resolve(userResponse);
                });
            return deferred.promise;
        }


        function findAllUsers() {
            //console.log("CLIENT USER SERVICE: findAllUsers called");
            var deferred = $q.defer();
            $http.get("/rest/api/user/")
                .success(function (userResponse) {
                    deferred.resolve(userResponse);
                });
            return deferred.promise;
        }

        function deleteUserById(userId) {
            $http.delete("/rest/api/user/"+userId)
                .success(function (userResponse) {
                    deferred.resolve(userResponse);
                });
            return deferred.promise;
        }


        function updateUser(user) {
            var deferred = $q.defer();
            var userId = user._id;
            console.log("UserService-Client, updating user");
            console.log(user);
            $http.put("/rest/api/user/" + userId, user)
                .success(function (userResponse) {
                    deferred.resolve(userResponse);
                });
            return deferred.promise;
        }

        function LoginUser(user){
            var deferred = $q.defer();
            //console.log(user);
            $http.post("/rest/api/login",user)
                .success(function (userObj){
                    deferred.resolve(userObj);
                });
            return deferred.promise;
        }

        function LogOutUser(){
            var deferred = $q.defer();
            $http.post("/rest/api/logout")
                .success(function (userObj){
                    deferred.resolve(userObj);
                });
            return deferred.promise;
        }

        //---------------------------------------------------------
        function AddFriendForUserId(userId, friendId){
            var deffered = $q.defer();
            $http.post("/rest/api/friend/"+userId+"/"+friendId)
                .success(function(userFriendObj){
                    deffered.resolve(userFriendObj);
                });
            return deffered.promise;
        }

        function findFriendsAndFollowersForId(userId){
            var deferred = $q.defer();
            $http.get("/rest/api/friends/"+userId)
                .success(function (friendsFollowersObj) {
                    deferred.resolve(friendsFollowersObj);
                });
            return deferred.promise;
        }

        function removeFriendorFollower(userId, friendId){
            var deferred = $q.defer();
            $http.delete("/rest/api/friend/"+userId+"/"+friendId)
                .success(function (userObj){
                    deferred.resolve(userObj);
                });
            return deferred.promise;
        }
        //----------------------------------------------------------------------------------

        function RemoveFavRestaurantForCurrentUser(bookId, userId){
            var deferred = $q.defer();
            $http.delete("/rest/api/bookfav/"+userId+"/"+bookId)
                .success(function (userFavs){
                    deferred.resolve(userFavs);
                });
            return deferred.promise;
        }

        function GetRestaurantDetailsById(bookId) {
            var deferred = $q.defer();
            $http.get("/rest/api/bookdetails/" + bookId)
                .success(function (bookObjRes) {
                    var bookObj = getBookDetails(bookObjRes)
                    deferred.resolve(bookObj);
                });
            return deferred.promise;
        }


        function getBookDetails(favbook){
            var bookObj = {};

            var volumeInfo = {};
            volumeInfo.title                        = favbook.title;

            var imageLinks = {}
            imageLinks.smallThumbnail               = favbook.thumbnailUrl;

            volumeInfo.imageLinks                   = imageLinks;
            volumeInfo.canonicalVolumeLink          = favbook.googlePreviewLink;
            volumeInfo.previewLink                  = favbook.googlePreviewLink;
            volumeInfo.averageRating                = parseFloat(parseInt(favbook.sentimentRating))/20;
            volumeInfo.description                  = favbook.description;

            bookObj.volumeInfo = volumeInfo;
            bookObj.id                              = favbook.ISBN_13;

            return bookObj;
        }


        function GetReviewsByUserId(userId){
            var deferred = $q.defer();

            $http.get("/rest/api/userReviews/"+userId)
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


        function getReviewsForRestaurantID(bookISBN){
            var deferred = $q.defer();
            $http.get("/rest/api/bookreviews/"+bookISBN)
                .success(function(bookReviews){
                   deferred.resolve(bookReviews);
                });
            return deferred.promise;
        }


        function submitReview(book, user, userReview){
            var reviewObj = { review    : userReview,
                              username  : user.username,
                              //centScore : centScore,
                              bookObj   : book };
            var deferred = $q.defer();
            $http.post("/rest/api/bookReview/"+ user._id, reviewObj)
                .success(function (reviewRes){
                    deferred.resolve(reviewRes);
                });
            return deferred.promise;
        }


        function GetFavRestaurantForCurrentUser(userId){
            var deferred = $q.defer();
            $http.get("/rest/api/bookfavs/"+userId)
                .success(function (userFavs){
                    deferred.resolve(userFavs);
                });
            return deferred.promise;
        }


        function addFavoriteRestaurantForUser(userId,book){
            var deferred = $q.defer();
            $http.post("/rest/api/bookfav/"+userId, book)
                .success(function (userFavObj) {
                   deferred.resolve(userFavObj);
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
    }
})();
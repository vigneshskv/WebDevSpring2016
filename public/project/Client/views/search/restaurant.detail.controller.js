"use strict";
(function(){
    angular
        .module("UrbanAppetizerApp")//,['ui.bootstrap'])
        .controller("BookDetailController",BookDetailController);


    function BookDetailController($window, $rootScope, $location, ClientSearchService, ClientUserService, ClientFavouriteService){

        var model = this;

        //model.searchQuery = searchQuery;
        //model.addFav = addFav;
        model.isLogin           = isLogin;
        model.submitReview      = submitReview;
        model.isUserLoggedin    = isUserLoggedin;
        model.isCurrentUser     = isCurrentUser;
        model.getFavButtonColor = getFavButtonColor;
        model.getFavButtonState = getFavButtonState;
        model.addFav            = addFav;
        model.hideAlert         = hideAlert;

        function hideAlert(alertName){
            if(alertName == "Fav") {
                model.addFavMsg = null;
            }
            if(alertName == "Blank") {
                model.reviewBlankMsg = null;
            }
            if(alertName == "Sentiment") {
                model.sentimentMsg = null;
            }
        }

        var userFavBookIds = [];
        getFavBooksForCurrentUser();

        function getFavBooksForCurrentUser() {
            if ($rootScope.user != null) {
                ClientFavouriteService.GetFavRestaurantsForCurrentUser($rootScope.user._id)
                    .then(function (userFavBooks) {
                        //console.log(userFavBooks);
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

        function addFav(book){
            console.log("book");
            console.log(book);
            ClientFavouriteService.addFavRestaurantForUser($rootScope.user._id,book)
                .then(function (favAddResult){
                    if(favAddResult != null) {
                        model.fav_class = "alert-success";
                        model.addFavMsg = "\""+book.name+ "\"" + " was added to your Favorites";
                        $window.scrollTo(0,0)
                        //searchQuery(model.searchQueryString);
                        getFavBooksForCurrentUser();
                    }else{
                        model.fav_class = "alert-warning";
                        model.addFavMsg = "You have already added this book as your favorites";
                        $window.scrollTo(0,0)
                    }
                });
        }

        model.book = JSON.parse($window.sessionStorage.getItem("currentRestaurant"));
        console.log(model.book);

        // set model.reviews
        getReviewsForBookISBN(model.book.id);

        function getReviewsForBookISBN(bookISBN){
            //console.log("fectching reviews for book "+model.book.volumeInfo.title);
            ClientFavouriteService.getReviewsForRestaurantID(bookISBN)
                .then(function(bookReviews){
                    console.log(bookReviews);
                    model.reviews = bookReviews;
                    //$rootScope.$apply();
                });
        }


        function isUserLoggedin(){
            if($rootScope.user) {
                if ($rootScope.user != null) {
                    return true;
                }
            }
            return false;
        }


        function isCurrentUser(username){
            if($rootScope.user){
                if($rootScope.user.username == username){
                    return true;
                }
            }
            return false;
        }


        function submitReview(userReview){
            if(!angular.isUndefined(userReview)){
                ClientFavouriteService.submitReview(model.book, $rootScope.user, userReview)
                    .then(function (reviewSubmitResult) {
                        //console.log(reviewSubmitResult);
                        clearTextArea();
                        getReviewsForBookISBN(model.book.id);
                    });
            }
        else{
                model.reviewBlankMsg = "Write a review in about 700 characters to submit!";
            }
        }

        function clearTextArea(){
            model.userReview = "";
        }

        function getcentScore(score){

            var centScore = (parseFloat(score) + 0.5) * 100;
            if(centScore > 100)
            {
                centScore = 100;
            }
            if(centScore < 0)
            {
                centScore = 5;
            }
            return centScore.toFixed(0);
        }

        function displayReviewFeedback(sentimentResp) {

            var score = parseFloat(sentimentResp.score);
            console.log(score);
            var type = sentimentResp.type;

            var centScore = (score + 0.5) * 100;
            var positivity;  // = "Positive";

            if (centScore >= 75)    {                       if(centScore > 100){
                                                                centScore = 100;
                                                            }
                                                            positivity = "Positive";
                                                            model.alert_class = "alert-success";}
            else if(centScore >= 50 && centScore < 75)  { positivity = "moderately Positive";
                                                            model.alert_class = "alert-info"}
            else if(centScore >= 31 && centScore < 50)  { positivity = "moderatly Negative";
                                                            model.alert_class = "alert-warning"}
            else if(centScore < 31)  { if(centScore < 0){
                                                                centScore = 5;
                                                            }

                                                            positivity = "Negative";
                                                            model.alert_class = "alert-danger";}

            model.sentimentMsg = "Review Submitted!  Your review was "+positivity+" and " +
                "scored "+centScore.toFixed(0)+ "% upon sentiment analysis";
            return;
        }


        function isLogin(){
            if($rootScope.user == null)
            {
                return true;
            }
            else{
                var loggedInUser = $rootScope.user.username;
                model.username = loggedInUser[0].toUpperCase() + loggedInUser.slice(1);
            }
        }



        function getFavButtonState(book){
            //console.log(book);
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

    }
})();
(function(){

    angular
        .module("UrbanAppetizerApp")
        .factory("ClientSearchService",ClientSearchService);

    function ClientSearchService($http,$q) {

        var service = {
            searchGoogleBooks           : searchGoogleBooks,
            analyseReview               : analyseReview,
            findRestuarantByTitle       : findRestuarantByTitle
        };
        return service;

        function randomString(length, chars) {
            var result = '';
            for (var i = length; i > 0; --i)
                result += chars[Math.round(Math.random() * (chars.length - 1))];
            return result;
        }


        function findRestuarantByTitle(title){
            var place = "boston";

            var deferred = $q.defer();
            var method = "GET";
            var url = "http://api.yelp.com/v2/search?callback=JSON_CALLBACK";
            var params;

            params = {
                callback: 'angular.callbacks._0',
                location: place,
                limit: 10,

                oauth_consumer_key: 'LRhQe7B3E8aZX7958OhD9w',
                oauth_token: '1Jhbrejc0L5lWRbpvgzlBW3ed_6d346K',
                oauth_signature_method: "HMAC-SHA1",
                oauth_timestamp: new Date().getTime(),
                oauth_nonce: randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'),
                term: title,
            };
            var consumerSecret = 'E6mupcRB0ew2vPTDQIHkoNjDEH8';
            var tokenSecret = 'zAEdXwfPq8U_EHmwTQyhHPbzLn8';
            var signature = oauthSignature.generate(method, url, params, consumerSecret, tokenSecret, {
                encodeSignature: false
            });

            //put signature in params
            params.oauth_signature = signature;

            $http.jsonp(url, {
                params: params
            }).success(function(response) {
                //deferred.resolve(response);
                if(response != null) {
                    console.log(response);
                    if(response.total === 0){
                        deferred.resolve(400);
                    }
                    var trimmedResponse = trimResponse(response);
                    deferred.resolve(trimmedResponse);
                    /*console.log(response.items);
                     return response.items;*/
                }
            }).error(function(response, status, header, config) {
                ////console.log(status);
                deferred.resolve(response);
            });
            return deferred.promise;
        }

        function findRestuarantDetailByID(restuarantID, callback){
            console.log("inside serivces resID :"+restuarantID)

            var deferred=$q.defer();
            var method = "GET";
            var url = "https://api.yelp.com/v2/business/"+restuarantID+"?callback=JSON_CALLBACK";

            var params = {
                callback: 'angular.callbacks._0',
                oauth_consumer_key: 'LRhQe7B3E8aZX7958OhD9w',
                oauth_token: '1Jhbrejc0L5lWRbpvgzlBW3ed_6d346K',
                oauth_signature_method: "HMAC-SHA1",
                oauth_timestamp: new Date().getTime(),
                oauth_nonce: randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'),
                term: "food",
            };
            var consumerSecret = 'E6mupcRB0ew2vPTDQIHkoNjDEH8';
            var tokenSecret = 'zAEdXwfPq8U_EHmwTQyhHPbzLn8';
            var signature = oauthSignature.generate(method, url, params, consumerSecret, tokenSecret, {
                encodeSignature: false
            });

            //put signature in params
            params.oauth_signature = signature;

            $http.jsonp(url, {
                params: params
            }).success(function(response){
                    deferred.resolve(response);
            }
            )
                .error(function(response) {

                    //deferred.resolve(response);

                });
            //return deferred.promise;
        }



//----------------------------------------------------------------------------------------------
        // get result from API for searchQuery
        function searchGoogleBooks(searchQuery) {
            //console.log("Client Search Service :: Searching for Query -> " + searchQuery);

            var url = "https://www.googleapis.com/books/v1/volumes?q=" + searchQuery + "&key=AIzaSyDX4yrNGscA-AsXKxw5mzD6oKxnjaukLT0"

            var deferred = $q.defer();
            $http.get(url)//+"&callback=JSON_CALLBACK")
                .success(function (response) {
                    //for all responses, set the description to 700 words
                    if(response != null) {

                        if(response.totalItems === 0){
                            deferred.resolve(400);
                        }
                        var trimmedResponse = trimResponse(response);
                        deferred.resolve(trimmedResponse);
                        /*console.log(response.items);
                         return response.items;*/
                    }
                    else
                    {
                        deferred.resolve(null);
                    }
                });
            //return "Dummy";
            return deferred.promise;
        }


        // reduce description and title length for displaying pretty
        function trimResponse(response){
            var responseItems = response.businesses;
            for(var i=0; i < responseItems.length; i++){
                if(responseItems[i].snippet_text &&  (responseItems[i].snippet_text.length > 700)) {
                    responseItems[i].snippet_text =
                        responseItems[i].snippet_text.substr(0,
                            responseItems[i].snippet_text.indexOf(' ', 695)) + ".....";
                }
                if(responseItems[i].name && (responseItems[i].name.length > 40 )){
                    responseItems[i].name = responseItems[i].name.substr(0,
                        responseItems[i].name.indexOf(' ', 40));
                }
            }
            var result = {};
            result.items = responseItems;

            return result;

        }


        function analyseReview(userReview) {
            //console.log("Client Search Service :: Searching for Query -> " + searchQuery);
            var alchemyUrl =    "http://gateway-a.watsonplatform.net/calls/text/TextGetTextSentiment?" +
                "apikey=b0c075efc347c9a79bdd0812534fd694f86e5dc1&" +
                "text="+userReview+"&outputMode=json&showSourceText=0"

            var deferred = $q.defer();
            $http.get(alchemyUrl)
                .success(function (response) {
                    //console.log(response);
                    /*console.log(response.docSentiment);
                    console.log(response.docSentiment.score);
                    console.log(response.docSentiment.type);*/
                    deferred.resolve(response);
                });
            return deferred.promise;
        }

    }

})();
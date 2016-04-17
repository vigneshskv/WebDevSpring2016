"use strict";
(function(){
    angular
        .module("UrbanAppetizerApp")
        .factory("ClientSearchService",ClientSearchService);

    function ClientSearchService($http,$q) {

        var service = {
            findRestuarantByTitle       : findRestuarantByTitle
        };
        return service;


        function randomString(length, chars) {
            var result = '';
            for (var i = length; i > 0; --i)
                result += chars[Math.round(Math.random() * (chars.length - 1))];
            return result;
        }


        function findRestuarantByTitle(title, location){
            var deferred = $q.defer();
            var method = "GET";
            var url = "http://api.yelp.com/v2/search?callback=JSON_CALLBACK";
            var params;

            params = {
                callback: 'angular.callbacks._0',
                location: location,
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
                if(response != null) {
                    //console.log(response);
                    if(response.total === 0)
                        deferred.resolve(400);
                    var trimmedResponse = trimResponse(response);
                    deferred.resolve(trimmedResponse);
                }
            }).error(function(err, status, header, config) {
                deferred.reject(err);
            });
            return deferred.promise;
        }

        function findRestuarantDetailByID(restuarantID, callback){
            //console.log("inside serivces resID :"+restuarantID)

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
    }
})();
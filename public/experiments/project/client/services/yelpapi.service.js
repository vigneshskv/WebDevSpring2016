(function(){
    angular
        .module("UrbanAppetizerApp")
        .factory("RestuarantService", restuarantService);

    function restuarantService($http){
        var api = {
            findRestuarantByTitle: findRestuarantByTitle,
            findRestuarantDetailByID: findRestuarantDetailByID
        };
        return api;

        function randomString(length, chars) {
            var result = '';
            for (var i = length; i > 0; --i)
                result += chars[Math.round(Math.random() * (chars.length - 1))];
            return result;
        }

        function findRestuarantByTitle(title, callback){
            var place = "boston";
            //var deferred = $q.defer();
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
            }).success(callback)
                .error(function(response, status, header, config) {
                    ////console.log(status);
                    //deferred.resolve(response);
                });
            //return deferred.promise;
        }

        function findRestuarantDetailByID(restuarantID, callback){
            console.log("inside serivces resID :"+restuarantID)

            restuarantID = "casa-razdora-boston";
            //var deferred=$q.defer();
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
            }).success(callback)
                .error(function(response) {

                    //deferred.resolve(response);

                });
            //return deferred.promise;
        }
    }
})();
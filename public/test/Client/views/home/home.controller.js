"use strict";
(function(){
    angular
        .module("UrbanAppetizerApp")
        .controller("HomeController",HomeController);


    function HomeController($window, $rootScope, $location){

        var model = this;

        model.searchQuery       = searchQuery;
        model.isNotLogin        = isNotLogin;

        function isNotLogin(){
            //console.log("checking if user is logged in");
            //console.log($rootScope.user);

            if ($rootScope.user == null) {
                return false;
            }
            return true;
        }

        //console.log("Hello from Home controller");
        function searchQuery(searchQueryString, searchLocationString){
            //console.log("func called");
            //console.log(searchQueryString);
            if(!angular.isUndefined(searchQueryString) && !angular.isUndefined(searchLocationString)){
                //$rootScope.searchQueryString = searchQueryString;
                $window.sessionStorage.searchQueryString = searchQueryString;
                $window.sessionStorage.searchLocationString = searchLocationString;
                $location.url("/search_result");
            }
        }
    }

})();
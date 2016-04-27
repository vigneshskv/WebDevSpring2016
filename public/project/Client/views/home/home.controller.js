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
            if ($rootScope.user == null)
                return false;
            return true;
        }


        function searchQuery(searchQueryString, searchLocationString){
            if(!angular.isUndefined(searchQueryString) && !angular.isUndefined(searchLocationString)){
                //$rootScope.searchQueryString = searchQueryString;
                $window.sessionStorage.searchQueryString = searchQueryString;
                $window.sessionStorage.searchLocationString = searchLocationString;
                $location.url("/search_result");
            }
        }
    }
})();
"use strict";

(function(){
    angular
        .module("UrbanAppetizerApp")
        .config(configuration);

    function configuration($routeProvider){
        $routeProvider
            .when("/home", {
                templateUrl: "home/home.view.html"
            })
            .when("/search", {
                templateUrl: "search/search.view.html"
            })
            .otherwise({
                redirectTo: "/home"
            });
    }
})();
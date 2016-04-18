"use strict";

(function(){
    angular
        .module("UrbanAppetizerApp")
        .controller("HeaderController", HeaderController);

    function HeaderController ($scope, $location, UserService) {
        UserService.checkLoggedIn();
        $scope.$location = $location;

        $scope.logout = function logout() {
            $location.url("/");
            UserService.setUser(null);
        }
    }
})();

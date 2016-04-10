"use strict";

(function(){
    angular
        .module("FormBuilderApp")
        .controller("AdminController", AdminController);

    function AdminController($scope, $location, UserService) {
        UserService.checkLoggedIn();
        UserService.checkUserAdmin();
        $scope.$location = $location;
    }
})();
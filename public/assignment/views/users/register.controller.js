"use strict";

(function(){
    angular
        .module("FormBuilderApp")
        .controller("RegisterController", RegisterController);

    function RegisterController($scope, $location, UserService ) {
        $scope.message = null;
        $scope.register = function(user){
            var userExists = UserService.userExists(user.username);
            if(userExists){
                $scope.message = "Username Already Exists";
                return;
            }
            UserService.createUser(user, function (user){
                UserService.setUser(user)
            });
            $location.url("/profile");
        };
    }
})();
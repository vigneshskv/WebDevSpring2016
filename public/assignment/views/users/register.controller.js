"use strict";

(function(){
    angular
        .module("FormBuilderApp")
        .controller("RegisterController", RegisterController);

    function RegisterController($scope, $location, UserService ) {
        $scope.register = register;

        function register(user) {
            $scope.message = null;

            if (user == null) {
                $scope.message = "Please fill in the required fields";
                return;
            }
            if (!user.username) {
                $scope.message = "Please provide a username";
                return;
            }
            if (!user.password || !user.verifyPassword) {
                $scope.message = "Please provide a password";
                return;
            }
            if (user.password != user.verifyPassword) {
                $scope.message = "Passwords must match";
                return;
            }

            var newUser = UserService.findUserByUsername(user.username);
            if (newUser != null) {
                $scope.message = "User already exists";
                return;
            }

            UserService.createUser(user, function (user){
                UserService.setUser(user)
            });
            $location.url("/profile");
        };
    }
})();
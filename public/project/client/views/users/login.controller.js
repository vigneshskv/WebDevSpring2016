"use strict";

(function(){
    angular
        .module("FormBuilderApp")
        .controller("LoginController", LoginController);

    function LoginController ($scope, $location, $rootScope, UserService) {
        $scope.message = null;
        $scope.login = login;

        function login (user){
            UserService.findUserByCredentials(user.username,user.password)
                .then(
                    function (user){
                        if (user.data != null){
                            UserService.setUser(user.data);
                            $location.url('/profile');
                        }
                        else {
                            $scope.message = "Invalid user credentials: Check entered username and password";
                        }
                    },
                    function (err){
                        $scope.message = "Failed to login, Please check credentials and retry";
                    }
                );
        }
    }
})();
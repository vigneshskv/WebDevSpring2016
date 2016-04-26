"use strict";

(function(){
    angular
        .module("FormBuilderApp")
        .controller("LoginController", LoginController);

    function LoginController ($scope, $location, $rootScope, UserService) {
        $scope.message = null;
        $scope.login = login;

        function login (user){

            UserService.login(user)
                .then(
                    function (user){
                        if (user.data != null){
                            UserService.setUser(user.data);
                            $location.url('/profile');
                        }
                        else {
                            $scope.message = "Invalid Username or Password";
                        }
                    },
                    function (err){
                        $scope.message = "Login Failed, Please try again";
                    }
                );
        }
    }
})();
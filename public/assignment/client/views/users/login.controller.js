"use strict";

(function(){
    angular
        .module("FormBuilderApp")
        .controller("LoginController", LoginController);

    function LoginController ($scope, $location, $rootScope, UserService) {

        console.log($rootScope.currentUser + " inside login controller");

        $scope.message = null;
        $scope.login = login;

        function login (user){

            UserService.findUserByCredentials(user.username,user.password)
                .then(
                    function (user){
                        if (user.data != null){
                            UserService.setUser(user.data);
                            $location.url('/profile');
                            console.log($rootScope.currentUser);
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
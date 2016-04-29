"use strict";
(function(){
    angular
        .module("UrbanAppetizerApp")
        .controller("LoginController",LoginController);


    function LoginController($location,ClientUserService,$rootScope){
        var model = this;
        model.login         =   login;
        model.loginPass     =   loginPass;

        function login(user){
            ClientUserService.findUserByUsernameAndPassword(user)
                .then(function(userResponse){
                    //console.log(userResponse);
                    userLoginCallback(userResponse);
                });
        }

        // passport JS login
        function loginPass(user){
            if(!angular.isObject(user)) {
                model.message = "All fields are required!";
                return;
            }else {
                ClientUserService.LoginUser(user)
                    .then(function (userResponse) {
                        //console.log(userResponse);
                        userLoginCallback(userResponse);
                    });
            }
        }


        function userLoginCallback(user){
            if(user != null){
                $rootScope.user = user;
                //console.log("user found, login sucessful");
                //console.log(user);
                $location.url("/home");
            }
            else
            {
                console.log("user not found, login failed");
            }
        }
    }
})();
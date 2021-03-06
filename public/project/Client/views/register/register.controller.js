"use strict";
(function(){
    angular
        .module("UrbanAppetizerApp")
        .controller("RegisterController",RegisterController);


    function RegisterController($location,ClientUserService,$rootScope) {
        //$scope.$location = $location;
        var model = this;
        //model.submitDisabled = false;
        model.registerNewUser = registerNewUser;
        //model.message = "Hi";


        //TODO  Check if email already exists
        //console.log($rootScope.user);
        console.log("Register Controller!!!!!");


        function registerNewUser(user) {
            model.submitDisabled = true;
            //console.log("Register called with following details");
            //console.log(user);
            var registrationPossible = true;
            var userResult;
            if(!angular.isObject(user)) {
                model.message = "All fields are mandatory!";
                registrationPossible = false;
                model.submitDisabled = false;
                return;
            }

            if(user.password == null || user.password == "undefined"){
                model.passwordMsg = "Password is mandotory";
                if (user.password != user.verifypassword) {
                    registrationPossible = false;
                    //console.log(registrationPossible);
                    //console.log("msg from password check")
                }
            }
            if(user.email == null || user.email == "undefined")
            {
                model.emailMsg="Email is mandatory";
                registrationPossible = false;
            }



            if(user.email == "undefined" ||
                user.email == "undefined" ||
                user.password == "undefined" ||
                user.verifypassword == "undefined"
            )
            {
                model.message = "All fields are mandatory";
                registrationPossible = false;
            }

            console.log("registrationpossible" +registrationPossible);

            if(user.username != null) {
                console.log("VIGNESH ENTERED IF LOOP");
                ClientUserService.findUserByUserName(user.username)
                    .then(
                        function (userResult) {
                            if (userResult) {
                                //console.log("username already present,returning");
                                registrationPossible = false;
                                model.message = "Username already exists, please choose a different username";
                                return;
                            }else {
                                console.log("reached create user in view");
                                ClientUserService.createUser(user)
                                    .then(function (retuser) {
                                        if (retuser != null) {
                                            //console.log(retuser.user);
                                            registerCallback(retuser.user);
                                        }
                                        else {
                                            model.submitDisabled = true;
                                            model.submitDisabled = false;
                                        }
                                    })
                            }
                        },function(err){
                            //console.log(err);
                        }
                    );
            }
        }


        function registerCallback(user){
            $rootScope.user = user;
            /*console.log("user obj from reg contr");
            console.log($rootScope.user);*/
            ClientUserService.LoginUser(user)
                .then(function(user){
                    $rootScope.user = user;
                    $location.url("/profile");
                });
        }
    }
})();
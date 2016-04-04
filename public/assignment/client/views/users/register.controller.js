"use strict";

(function(){
    angular
        .module("FormBuilderApp")
        .controller("RegisterController", RegisterController);

    function RegisterController($scope, $location, UserService ) {
        $scope.message = null;
        $scope.register = register;

        function register(user){

            var userName = user.username;

            UserService.findUserByUsername(userName)
                .then(function (userPresent){
                        if(userPresent.data == null){
                            UserService.createUser(user)
                                .then(function (user) {
                                        UserService.setUser(user.data);
                                        $location.url("/profile");
                                    },
                                    function (err){
                                        $scope.message = "Unable to register";
                                    });
                        }else{
                            $scope.message = "User with same name already Exists";
                        }
                    },
                    function(err){
                        $scope.message = "User with same name already Exists";
                    });
        }


    }
})();
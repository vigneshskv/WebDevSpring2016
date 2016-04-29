"use strict";
(function(){
    angular
        .module("UrbanAppetizerApp")
        .factory("ClientUserService",ClientUserService);

    function ClientUserService($rootScope, $http, $q) {
        var service = {
            // user profile functions
            createUser                      : createUser,
            findUserById                    : findUserById,
            findUserByUserName              : findUserByUserName,
            findUserByUsernameAndPassword   : findUserByUsernameAndPassword,
            findAllUsers                    : findAllUsers,
            deleteUserById                  : deleteUserById,
            updateUser                      : updateUser,
            LoginUser                       : LoginUser,
            LogOutUser                      : LogOutUser
        };
        return service;


        function createUser(user) {
            var deferred = $q.defer();
            $http.post("/api/user", user)
                .success(function (user) {
                    deferred.resolve(user);
                });
            return deferred.promise;
        }


        function findUserById(userId) {
            var deferred = $q.defer();
            $http.get("/api/user/" + userId)
                .success(function (userResponse) {
                    deferred.resolve(userResponse);
                });
            return deferred.promise;
        }


        function findUserByUserName(username) {
            var deferred = $q.defer();
            $http.get("/api/user?username="+username)
                .success(function (userResponse) {
                    deferred.resolve(userResponse);
                })
                .error(function (err){
                    console.log(err);
                    deferred.reject(err);
                });
            return deferred.promise;
        }

        function findUserByUsernameAndPassword(user) {
            var deferred = $q.defer();
            $http.get("/api/user?username=" + user.username + "&password=" + user.password)
                .success(function (userResponse) {
                    deferred.resolve(userResponse);
                });
            return deferred.promise;
        }


        function findAllUsers() {
            var deferred = $q.defer();
            $http.get("/api/user/")
                .success(function (userResponse) {
                    deferred.resolve(userResponse);
                });
            return deferred.promise;
        }


        function deleteUserById(userId) {
            $http.delete("/api/user/"+userId)
                .success(function (userResponse) {
                    deferred.resolve(userResponse);
                });
            return deferred.promise;
        }


        function updateUser(user) {
            var deferred = $q.defer();
            var userId = user._id;
            $http.put("/api/user/" + userId, user)
                .success(function (userResponse) {
                    deferred.resolve(userResponse);
                });
            return deferred.promise;
        }

        function LoginUser(user){
            var deferred = $q.defer();
            $http.post("/api/login",user)
                .success(function (userObj){
                    deferred.resolve(userObj);
                })
                .error(function(err){
                    deferred.reject(err);
                });

            return deferred.promise;
        }


        function LogOutUser(){
            var deferred = $q.defer();
            $http.post("/api/logout")
                .success(function (userObj){
                    deferred.resolve(userObj);
                });
            return deferred.promise;
        }
    }
})();
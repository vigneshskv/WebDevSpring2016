"use strict";
(function(){
    angular
        .module("FormBuilderApp")
        .factory("UserService", UserService);

    function UserService($http, $rootScope, $location) {
        var userService = {
            findUserByCredentials: findUserByCredentials,
            findAllUsers: findAllUsers,
            createUser: createUser,
            deleteUserById: deleteUserById,
            updateUser: updateUser,

            setUser: setUser,
            getUser: getUser,
            findUserbyId: findUserbyId,
            checkLoggedIn: checkLoggedIn,
            checkUserAdmin: checkUserAdmin,
            findUserByUsername : findUserByUsername
        };

        return userService;

        function findUserByCredentials(username, password) {
            return $http.get("/api/assignment/user?username="+username+"&password="+password);
        }

        function findAllUsers() {
            return $http.get("/api/assignment/user");
        }

        function createUser(user){
            return $http.post("/api/assignment/user",user);
        }

        function deleteUserById(userId){
            return  $http.delete("/api/assignment/user/"+userId);
        }

        function updateUser(userId, user){
            return $http.put("/api/assignment/user/"+userId, user);
        }


        function setUser(user){
            $rootScope.currentUser = user;
        }

        function getUser(){
            return $rootScope.currentUser;
        }

        function findUserbyId(userId){
            return $http.get("/api/assignment/user/:"+userId);
        }

        function checkLoggedIn(){
            if( $rootScope.currentUser == null)
                $location.url("/");
        }

        function checkUserAdmin(){
            if( $rootScope.currentUser == null || currentUser.roles.indexOf('admin') >= 0)
                $location.url("/");
        }

        function findUserByUsername(username){
            return $http.get("/api/assignment/user?username="+username);
        }
    }
})();
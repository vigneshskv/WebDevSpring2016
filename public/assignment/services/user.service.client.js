"use strict";
(function(){

    angular
        .module("FormBuilderApp")
        .factory("UserService", UserService);

    function UserService($http, $rootScope, $location) {
        var users = [];

        users = [
            {	"_id":123, "firstName":"Alice",            "lastName":"Wonderland",
                "username":"alice",  "password":"alice",   "roles": ["student"]		},
            {	"_id":234, "firstName":"Bob",              "lastName":"Hope",
                "username":"bob",    "password":"bob",     "roles": ["admin"]		},
            {	"_id":345, "firstName":"Charlie",          "lastName":"Brown",
                "username":"charlie","password":"charlie", "roles": ["faculty"]		},
            {	"_id":456, "firstName":"Dan",              "lastName":"Craig",
                "username":"dan",    "password":"dan",     "roles": ["faculty", "admin"]},
            {	"_id":567, "firstName":"Edward",           "lastName":"Norton",
                "username":"ed",     "password":"ed",      "roles": ["student"]		}
        ];

        var userService = {
            findUserByCredentials: findUserByCredentials,
            findAllUsers: findAllUsers,
            createUser: createUser,
            deleteUserById: deleteUserById,
            updateUser: updateUser,

            userExists: checkIfUserExists,
            setUser: setUser,
            getUser: getUser,
            findUserbyId: findUserbyId,
            checkLoggedIn: checkLoggedIn,
            checkUserAdmin: checkUserAdmin,
            findUserByUsername : findUserByUsername

        };

        return userService;

        function findUserByCredentials(username, password, callback) {
            var userFound=null;
            for (var i in users){
                if(users[i].username == username && users[i].password == password){
                    userFound=users[i];
                    console.log("user found: "+username+"\"+password");
                    break;
                    //callback(users[i]);
                }
            }
            callback(userFound);
        }

        function findAllUsers(callback) {
            callback(users);
        }

        function createUser(user, callback){
            var newUser = {
                _id : (new Date).getTime(),
                username :  user.username,
                password : user.password,
                email: user.email
            };
            users.push(newUser);
            callback(newUser);
        }

        function deleteUserById(userId, callback){
            for(var i=0; i<users.length; i++){
                if(users[i]._id == userId){
                    users.splice(i,1);
                    callback(users);
                    break;
                }
            }
        }

        function updateUser(userId, user, callback){
            var i;
            for(i=0;i<users.length;i++)
            {
                if(users[i]._id===userId)
                {
                    users[i] = user;
                    console.log(users[i]);
                    console.log(users);
                    break;
                }
            }
            callback(users[i]);
        }

        // Auxilary Functions
        function findUserbyId(userId){
            for(var i=0; i<users.length; i++){
                if(users[i]._id == userId){
                    return users[i];
                }
            }
            return null;
        }

        function checkIfUserExists(userName){
            for(var i=0; i<users.length; i++){
                if(users[i].username == userName){
                    return true;
                }
            }
            return false;
        }

        function findUserByUsername (username) {
            for (var u in users) {
                if (users[u].username === username) {
                    return users[u];
                }
            }
            return null;
        }

        function checkLoggedIn(){
            if( $rootScope.currentUser == null){
                $location.url("/");
            }
        }

        function checkUserAdmin(){
            if( $rootScope.currentUser == null || currentUser.roles.indexOf('admin') >= 0){
                $location.url("/");
            }
        }

        function setUser(user){
            $rootScope.currentUser = user;
        }

        function getUser(){
            return $rootScope.currentUser;
        }
    }
})();
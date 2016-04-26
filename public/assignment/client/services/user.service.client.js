(function(){

    angular
        .module("FormBuilderApp")
        .factory("UserService", UserService);

    function UserService($http, $rootScope, $location) {

        var userService = {
            findUserByCredentials: findUserByCredentials,
            findUserByUsername:findUserByUsername,
            //findAllUsers: findAllUsers,
            register: register,
            deleteUserById: deleteUserById,
            //updateUser: updateUser,
            setUser: setUser,
            getUser: getUser,
            findUserbyId: findUserbyId,
            checkLoggedIn: checkLoggedIn,
            checkUserAdmin: checkUserAdmin,
            getCurrentUser:getCurrentUser,
            logout:logout,
            login:login,
            userLogin:userLogin,

            createUser: createUser,
            findAllUsers: findAllUsers,
            findUserById: findUserById,
            deleteUser: deleteUser,
            updateUser: updateUser,
            updateUserById: updateUserById

        };

        return userService;

        function createUser(user) {
            return $http.post("/api/assignment/admin/user", user);
        }

        function findAllUsers() {
            return $http.get("/api/assignment/admin/user/");
        }

        function findUserById(userId){
            return $http.get("/api/assignment/admin/user/"+ userId)
        }

        function deleteUser(userId) {
            return $http.delete('/api/assignment/admin/user/'+userId);
        }

        function updateUserById(userId, user) {
            return $http.put("/api/assignment/admin/user/"+userId, user, {headers: {'Content-Type': 'application/json'} });
        }

        function getCurrentUser(){
            return $http.get("/api/assignment/loggedin");
        }

        function logout() {
            return $http.post("/api/assignment/logout");
        }

        function userLogin(user){
            return $http.post("/api/assignment/login", user);
        }

        function findUserByCredentials(username, password) {
            return $http.get("/api/assignment/user?username="+username+"&password="+password);
        }

        function findUserByUsername(username){
            return $http.get("/api/assignment/user?username="+username);
        }

        function findUserbyId(userId){
            return $http.get("/api/assignment/user/:"+userId);
        }

        function login(user) {
            return $http.post('/api/assignment/login', user);
        }

        function register(user){
            return $http.post("/api/assignment/register",user);
        }

        function deleteUserById(userId){
            return  $http.delete("/api/assignment/user/"+userId);
        }

        function updateUser(userId, user){
            return $http.put("/api/assignment/user/"+userId, user);
        }


        function checkLoggedIn(){
            if( $rootScope.currentUser == null)
                $location.url("/");
        }

        function checkUserAdmin(){
            if( $rootScope.currentUser == null || currentUser.roles.indexOf('admin') >= 0)
                $location.url("/");
        }

        function setUser(user){
            $rootScope.currentUser = user;
        }

        function getUser(){
            return $rootScope.currentUser;
        }


    }
})();
"use strict";

(function(){
    angular
        .module("FormBuilderApp")
        .controller("ProfileController", ProfileController);

    function ProfileController ($scope, $location, $rootScope, UserService) {
        UserService.checkLoggedIn();
        $scope.user = UserService.getUser();
        $scope.update = function (){

            var updateUserDetail = function (updatedUser) {
                if (updatedUser != null) {
                    UserService.setUser(updatedUser);
                    $scope.message = "User updated successfully";
                }
            };
            UserService.updateUser( $rootScope.currentUser._id, $scope.user, updateUserDetail);
        }
    }
})();
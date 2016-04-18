"use strict";

(function(){
    angular
        .module("FormBuilderApp")
        .controller("ProfileController", ProfileController);

    function ProfileController ($scope, $rootScope, UserService) {
        UserService.checkLoggedIn();

        $scope.user = UserService.getUser();
        $scope.update = update;

        function update($scope, user){
            UserService.updateUser( $rootScope.currentUser._id, user)
                .then(
                    function (updatedUser){
                        if (updatedUser.data != null) {
                            UserService.setUser(updatedUser.data);
                            $scope.message = "User profile information updated successfully";
                        }
                        else
                            $scope.message = "Failed to update User information";
                    },
                    function (error){
                        $scope.message = "Failed to update User information";
                    });
        }
    }
})();
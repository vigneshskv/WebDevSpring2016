"use strict";

(function(){
    angular
        .module("FormBuilderApp")
        .controller("ProfileController", ProfileController);

    function ProfileController ($scope, $rootScope, UserService) {
        $scope.user = $rootScope.currentUser;

        $scope.update = update;

        function update(user){

            UserService.updateUser( $rootScope.currentUser._id, user)
                .then(
                    function (updatedUser){
                        if (updatedUser.data != null) {
                            UserService.setUser(updatedUser.data);
                            $scope.message = "User updated successfully";
                        }
                        else
                            $scope.message = "Cannot update User";
                    },
                    function (error){
                        $scope.message = "Cannot update User";
                    });
        }
    }
})();
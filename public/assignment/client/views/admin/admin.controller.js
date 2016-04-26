"use strict";

(function(){
    angular
        .module("FormBuilderApp")
        .controller("AdminController", AdminController);

    function AdminController($scope, $location, UserService) {

        var vm = this;

        vm.remove = remove;
        vm.update = update;
        vm.add    = add;
        vm.select = select;
        vm.sortField = 'username';
        vm.order = "false";

        function init() {
            UserService
                .findAllUsers()
                .then(handleSuccess, handleError);
        }
        init();


        function handleSuccess(response) {

            for(var i in response.data) {
                response.data[i].roles = response.data[i].roles.toString();
            }
            vm.users = response.data;

        }

        function handleError(error) {
            vm.error = error;
        }


        function remove(user, index)
        {
            UserService
                .deleteUser(user._id)
                .then(function(response) {
                    UserService
                        .findAllUsers()
                        .then(handleSuccess, handleError);
                });
        }

        function update(user)
        {
            UserService
                .updateUserById(user._id, user)
                .then(handleSuccess, handleError);
        }



        function add(user)
        {
            var newUser = {
                username: user.username,
                password: user.password,
                firstName: user.firstName,
                lastName: user.lastName,
                roles : user.roles
            };
            UserService
                .createUser(newUser)
                .then(handleSuccess, handleError);
        }

        function select(user)
        {
            vm.selectedUser = user;
            vm.user = {
                _id : vm.selectedUser._id,
                username : vm.selectedUser.username,
                password : vm.selectedUser.password,
                firstName : vm.selectedUser.firstName,
                lastName : vm.selectedUser.lastName,
                email : vm.selectedUser.email,
                phones : vm.selectedUser.phones,
                roles : vm.selectedUser.roles,
                type : vm.selectedUser.type
            };
        }
    }
})();
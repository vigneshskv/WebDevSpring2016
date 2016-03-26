"use strict";

(function(){
    angular
        .module("FormBuilderApp")
        .controller("FormController", FormController);

    function FormController($scope, $location, UserService, FormService) {
        UserService.checkLoggedIn();

        $scope.error = null;
        $scope.selectedForm = null;
        $scope.addForm=addForm;
        $scope.updateForm=updateForm;
        $scope.deleteForm=deleteForm;
        $scope.selectForm=selectForm;

        $scope.user = UserService.getUser();
        //$scope.forms = FormService.findUserForm($scope.user._id);

        FormService.findUserForms($scope.user._id)
            .then(function(forms){
                    $scope.forms = forms.data;
                },
                function(err){

                });

        function addForm(form){
            FormService.createFormForUser($scope.user._id, form)
                .then(function (userForms){
                        $scope.forms = userForms.data;
                        $scope.error = null;
                    },
                    function (err){
                        $scope.error = "No Forms";
                    });
        }

        function updateForm(form){
            var formUpdated = {
                _id : form._id,
                title : form.title,
                userId : form.userId
            };

            FormService.updateFormById(formUpdated._id, form)
                .then(function(userForms){
                        if(userForms != null){
                            $scope.forms = userForms.data;
                            $scope.error = null;
                        }
                        else{
                            $scope.error = "Form name cannot be empty";
                        }
                    },
                    function(err){
                        scope.error = "Cannot Update";
                    });
        }

        function deleteForm(index){
            FormService.deleteFormById($scope.forms[index]._id)
                .then(function(userForms){
                        if(userForms != null){
                            $scope.forms = userForms.data;
                            $scope.error = null;
                        }
                        else{
                            $scope.error = "Form Not Present";
                        }
                    },
                    function(err){
                        scope.error = "Cannot Delete";
                    });
        }

        function selectForm(index){
            $scope.selectedForm =$scope.forms[index];
            $scope.selectedIndex = index;
            $scope.form  =  {
                _id : $scope.selectedForm._id,
                title : $scope.selectedForm.title,
                userId : $scope.selectedForm.userId,
                fields : $scope.selectedForm.fields
            };
        }
    }
})();
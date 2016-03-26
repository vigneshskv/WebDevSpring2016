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

        FormService.findUserForms($scope.user._id)
            .then(function(forms){
                    $scope.forms = forms.data;
                },
                function(err){

                });

        function addForm(form){
            FormService.createFormForUser($scope.user._id, form)
                .then(function (userForms) {
                        if (userForms.data != null) {
                            $scope.forms = userForms.data;
                            $scope.error = null;
                        }
                        else {
                            $scope.error = "Please enter Form name- Form name cannot be empty";
                        }
                    },
                    function (err){
                        $scope.error = "No valid Forms";
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
                        if(userForms.data != null){
                            $scope.forms = userForms.data;
                            $scope.error = null;
                        }
                        else{
                            $scope.error = "Please enter Form name- Form name cannot be empty";
                        }
                    },
                    function(err){
                        scope.error = "Cannot Update the Form";
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
                            $scope.error = "Form doesnot exists";
                        }
                    },
                    function(err){
                        scope.error = "Cannot delete the Form";
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
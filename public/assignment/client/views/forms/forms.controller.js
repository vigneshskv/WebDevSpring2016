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

        console.log("Inside controller");
        FormService.findUserForms($scope.user._id)
            .then(function(forms){
                    $scope.forms = forms.data;
                },
                function(err){
                    $scope.error = null;
                });


        function addForm(form){

            if(typeof form != "undefined"){
                FormService.createFormForUser($scope.user._id, form)
                    .then(function (newForm){
                            if(newForm.data !== null){
                                FormService.findUserForms($scope.user._id)
                                    .then(function(userForms){
                                            $scope.forms = userForms.data;
                                            $scope.error = null;
                                        },
                                        function(err){
                                            $scope.error = "User does not have any form";
                                        });
                            }else{
                                $scope.error = "Name of the form cannot be empty";
                            }},
                        function (err){
                            $scope.error = "Unable to create the form";
                        });
            }else{
                $scope.error = "Name of the form cannot be empty";
            }
        }

        function updateForm(form){

            var formUpdated = {
                _id : form._id,
                title : form.title,
                userId : form.userId
            };

            if(form.title != ""){
                FormService.updateFormById(formUpdated._id, form)
                    .then(function(updatedForm){
                            FormService.findUserForms($scope.user._id)
                                .then(function(userForms){
                                        $scope.forms = userForms.data;
                                        $scope.error = null;
                                    },
                                    function(err){
                                        $scope.error = "User does not have any form";
                                    });
                        },
                        function(err){
                            $scope.error = "Unable to update form information";
                        });
            }
            else{
                $scope.error = "Name of the form cannot be empty";
            }
        }

        function deleteForm(index){

            FormService.deleteFormById($scope.forms[index]._id)
                .then(function(userForms){
                        FormService.findUserForms($scope.user._id)
                            .then(function(userForms){
                                    $scope.forms = userForms.data;
                                    $scope.error = null;
                                },
                                function(err){
                                    $scope.error = "User does not have any form";
                                });
                    },
                    function(err){
                        $scope.error = "Unable to delete form";
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
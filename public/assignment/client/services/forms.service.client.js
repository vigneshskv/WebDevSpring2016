"use strict";

(function(){
    angular
        .module("FormBuilderApp")
        .factory("FormService", FormService);

    function FormService($http) {
        var formService = {
            createFormForUser: createFormForUser,
            findUserForms : findUserForms,
            findFormById:findFormById,
            getCurrentForms: getCurrentForms,
            deleteFormById: deleteFormById,
            updateFormById: updateFormById
        };
        return formService;

        function createFormForUser(userId, form){
            return $http.post("/api/assignment/user/"+userId+"/form", form);
        }

        function findUserForms(userId){
            return $http.get("/api/assignment/user/"+userId+"/form");
        }

        function findFormById(formId){
            return $http.get("/api/assignment/form/"+formId);
        }

        function getCurrentForms(){
            return forms;
        }

        function deleteFormById(formId){
            return $http.delete("/api/assignment/form/"+formId);
        }

        function updateFormById(formId, newForm){
            return $http.put("/api/assignment/form/"+formId, newForm)
        }
    }
})();
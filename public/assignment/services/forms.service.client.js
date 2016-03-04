(function(){

    angular
        .module("FormBuilderApp")
        .factory("FormService", FormService);

    function FormService($http, $rootScope) {
        var forms = [];

        forms = [
            {"_id": "000", "title": "Contacts", "userId": 123},
            {"_id": "010", "title": "ToDo",     "userId": 123},
            {"_id": "020", "title": "CDs",      "userId": 234}
        ];

        var formService = {
            createFormForUser: createFormForUser,
            findAllFormsForUser: findAllFormsForUser,
            deleteFormById: deleteFormById,
            updateFormById: updateFormById,
            getCurrentForms: getCurrentForms
        };

        return formService;


        function createFormForUser(userId, form, callback){
            if (form != null && form.title != ""){
                var newForm = {
                    _id : (new Date).getTime(),
                    title: form.title,
                    userId : userId
                };
                forms.push(newForm);
                callback(newForm);
                return;
            }
            callback(null);
        }

        function findAllFormsForUser(userId, callback){
            var userForm=[];
            for(var i in forms){
                if(forms[i].userId == userId){
                    userForm.push(forms[i]);
                }
            }
            callback(userForm);
        }

        function deleteFormById(formId, callback){

            forms = forms.filter( function(form){
                return form._id != formId;
            });
            callback(forms);
        }

        function updateFormById(formId, newForm, callback){
            if(newForm.title != ""){
                for (var i in forms){
                    if(forms[i]._id === formId){
                        forms[i] ={
                            _id : newForm._id,
                            title : newForm.title,
                            userId : newForm.userId
                        };

                        callback(forms[i]);
                        return;
                    }
                }
            }
            else{
                callback(null);
            }
        }

        function findFormById(formId){
            for( var i in forms){
                if(forms[i]._id === formId){
                    return forms[i];
                }
                else{
                    return null;
                }
            }
        }

        function getCurrentForms(){
            return forms;
        }
    }


})();
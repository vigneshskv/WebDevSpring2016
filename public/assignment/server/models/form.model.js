module.exports = function (db,mongoose,FormModel){
    var q = require('q');
    var forms = require("./form.mock.json");

    var api = {
        findFormByUserId:findFormByUserId,
        findFormById:findFormById,
        deleteFormById:deleteFormById,
        createForm:createForm,
        updateFormById:updateFormById,
        findFormByTitle:findFormByTitle,
    };

    return api;

    function findFormByUserId(userId){
        var deferred = q.defer();
        FormModel.find({"userId":userId}, function(err,forms){
            if(err)
                deferred.reject(err);
            else
                deferred.resolve(forms);
        });

        return deferred.promise;
    }

    function findFormById(formId){
        var deferred = q.defer();
        FormModel.findById({_id : formId}, function(err,forms){
            if(err)
                deferred.reject(err);
            else
                deferred.resolve(forms);
        });
        return deferred.promise;
    }

    function deleteFormById(formId){
        var deferred = q.defer();
        FormModel.findByIdAndRemove({"_id": formId}, function(err,forms){
            if(err)
                deferred.reject(err);
            else
                deferred.resolve(forms);
        });

        return deferred.promise;
    }

    function createForm(form, userId){
        console.log("createForm");
        console.log(form);
        var deferred = q.defer();
        if ( form.title != "" ){

            var newForm = {
                title: form.title,
                userId : userId,
                fields : []
            };

            FormModel.create(newForm, function(err,form){
                if(err)
                    deferred.reject(err);
                else
                    console.log(form);
                    deferred.resolve(form);
            });
            return deferred.promise;
        }
        deferred.resolve(null);
        return deferred.promise;
    }

    function updateFormById(newForm,formId){
        if(newForm.title != "") {

            var deferred = q.defer();

            FormModel.findById({"_id":formId},function(err,form){
                if(err)
                    deferred.reject(err);
                else{
                    form.title = newForm.title;
                    form.userId = newForm.userId;
                    form.fields = newForm.fields;
                    form.save(function(err,updatedForm){
                        if(err)
                            deferred.reject(err);
                        else
                            deferred.resolve(updatedForm);
                    });
                }
            });
            return deferred.promise;
        }else{
            return null;
        }
    }

    function findFormByTitle(title){
        var deferred = q.defer();
        FormModel.findOne({title:title}, function(err, form){
            if(err)
                deferred.reject(err);
            else
                deferred.resolve(form);
        });
        return deferred.promise;
    }
};
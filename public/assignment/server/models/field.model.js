module.exports = function (db,mongoose,FormModel,FieldModel){
    var q = require('q');
    var newFieldId = require('node-uuid');

    var api = {
        createFieldForForm: createFieldForForm,
        getFieldsForForm:getFieldsForForm,
        getFieldForForm:getFieldForForm,
        deleteFieldFromForm:deleteFieldFromForm,
        updateField:updateField
    };

    return api;

    function createFieldForForm(formId,field){
        var deferred = q.defer();
        var newField = {
            type:field.type,
            placeholder:field.placeholder,
            label:field.label,
            options:field.options};

        FieldModel.create(newField, function(err,field){
            if(!err){
                FormModel.findById(formId)
                    .then(function (form) {
                        form.fields.push(newField);
                        form.save(function(err,newForm){
                            if(err){
                                deferred.reject(err);
                            }else{
                                deferred.resolve(newForm.fields);
                            }
                        })

                    }, function (err){
                        deferred.reject(err);
                    });
            }
        });
        return deferred.promise;
    }

    function getFieldsForForm(formId){
        var deferred = q.defer();
        FormModel.findById(formId,
            function(err,form){
                if(err)
                    deferred.reject(err);
                else
                    deferred.resolve(form.fields);
            });
        return deferred.promise;
    }

    function getFieldForForm(formId,fieldId){
        var deferred = q.defer();
        FormModel.find({"_id":formId,"fields._id":fieldId},
            function(err,form){
                if(err)
                    deferred.reject(err);
                else
                    deferred.resolve(form.fields[0]);
            });
        return deferred.promise;
    }

    function deleteFieldFromForm(formId,fieldId){
        var deferred = q.defer();
        FormModel.findById(formId,
            function(err,form){
                if(err)
                    deferred.reject(err);
                else{
                    form.fields.pull({_id: fieldId});
                    form.save(function (err,newForm){
                        if(err)
                            deferred.reject(err);
                        else
                            deferred.resolve(newForm.fields);
                    });
                }
            });
        return deferred.promise;
    }

    function updateField(formId,fieldId,field){
        var deferred = q.defer();
        FormModel.findById(formId)
            .then(function(form){
                var newField = form.fields.id(fieldId);
                newField.type = field.type;
                newField.placeholder = field.placeholder;
                newField.label = field.label;
                newField.options = field.options;
                form.save(function(err,form){
                    if(err)
                        deferred.reject(err);
                    else
                        deferred.resolve(form.fields);
                });
            },function(err){
                deferred.reject(err);
            });
        return deferred.promise;
    }
};
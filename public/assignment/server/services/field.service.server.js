module.exports = function (app, fieldModel){

    app.post("/api/assignment/form/:formId/field",createFieldForForm);
    app.get("/api/assignment/form/:formId/field",getFieldsForForm);
    app.get("/api/assignment/form/:formId/field/:fieldId",getFieldForForm);
    app.delete("/api/assignment/form/:formId/field/:fieldId",deleteFieldFromForm);
    app.put("/api/assignment/form/:formId/field/:fieldId",updateField);

    function createFieldForForm(req,res){
        fieldModel.createFieldForForm(req.params.formId,req.body)
            .then( function(fields){
                    res.json(fields);
                },
                function(err){
                    res.status(400).send(err);
                }
            );
    }

    function getFieldsForForm(req,res){
        fieldModel.getFieldsForForm(req.params.formId)
            .then(function(fields){
                    res.json(fields);
                },
                function(err){
                    res.status(400).send(err);
                }
            );
    }

    function getFieldForForm(req,res){
        fieldModel.getFieldForForm(req.params.formId,req.params.fieldId)
            .then(function(field){
                    res.json(field);
                },
                function(err){
                    res.status(400).send(err);
                }
            );
    }

    function deleteFieldFromForm(req,res){
        fieldModel.deleteFieldFromForm(req.params.formId,req.params.fieldId)
            .then(function(field){
                    res.json(field);
                },
                function(err){
                    res.status(400).send(err);
                }
            );
    }

    function updateField(req,res){
        fieldModel.updateField(req.params.formId,req.params.fieldId,req.body)
            .then(function(field){
                    res.json(field);
                },
                function(err){
                    res.status(400).send(err);
                }
            );
    }

};
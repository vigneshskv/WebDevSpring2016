"use strict";

module.exports = function (app, formModel){
    app.get("/api/assignment/user/:userId/form", findFormByUserId);
    app.get("/api/assignment/form/:formId", findFormById);
    app.delete("/api/assignment/form/:formId", deleteFormById);
    app.post("/api/assignment/user/:userId/form", createForm);
    app.put("/api/assignment/form/:formId", updateFormById);

    function findFormByUserId(req,res){
        formModel.findFormByUserId(req.params.userId)
            .then(function(forms){
                    res.json(forms);
                },
                function(err){
                    res.status(400).send(err);
                });

    }

    function findFormById(req,res){
        formModel.findFormById(req.params.formId)
            .then( function(form){
                    res.json(form);
                },
                function(err){
                    res.status(400).send(err);
                }
            );
    }

    function deleteFormById(req,res){
        formModel.deleteFormById(req.params.formId)
            .then( function(form){
                    res.json(form);
                },
                function(err){
                    res.status(400).send(err);
                }
            );
    }

    function createForm(req,res){
        formModel.createForm(req.body, req.params.userId)
            .then( function(form){
                    res.json(form);
                },
                function(err){
                    res.status(400).send(err);
                }
            );
    }

    function updateFormById(req,res){
        formModel.updateFormById(req.body, req.params.formId)
            .then(function (updatedForm){
                    res.json(updatedForm);
                },
                function(err){
                    res.status(400).send(err);
                }
            );
    }
};
module.exports = function (app, formModel){
    app.get("/api/assignment/user/:userId/form", findFormByUserId);
    app.get("/api/assignment/form/:formId", findFormById);
    app.delete("/api/assignment/form/:formId", deleteFormById);
    app.post("/api/assignment/user/:userId/form", createForm);
    app.put("/api/assignment/form/:formId", updateFormById);

    function findFormByUserId(request,result){
        var forms = formModel.findFormByUserId(request.params.userId);
        result.json(forms);
    }

    function findFormById(request,result){
        var form = formModel.findFormById(request.params.formId);
        result.json(form)
    }

    function deleteFormById(request,result){
        var forms = formModel.deleteFormById(request.params.formId);
        result.json(forms);
    }

    function createForm(request,result){
        var newForms = formModel.createForm(request.body, request.params.userId);
        result.json(newForms);
    }

    function updateFormById(request,result){
        var forms = formModel.updateFormById(request.body, request.params.formId);
        result.json(forms);
    }
};
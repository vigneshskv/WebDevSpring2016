module.exports = function (app, formModel){
    app.post("/api/assignment/form/:formId/field",createFieldForForm);
    app.get("/api/assignment/form/:formId/field",getFieldsForForm);
    app.get("/api/assignment/form/:formId/field/:fieldId",getFieldForForm);
    app.delete("/api/assignment/form/:formId/field/:fieldId",deleteFieldFromForm);
    app.put("/api/assignment/form/:formId/field/:fieldId",updateField);

    function createFieldForForm(request,result){
        var fields = formModel.createFieldForForm(request.params.formId,request.body);
        result.json(fields);
    }

    function getFieldsForForm(request,result){
        var fields = formModel.getFieldsForForm(request.params.formId);
        result.json(fields);
    }

    function getFieldForForm(request,result){
        var field = formModel.getFieldForForm(request.params.formId,request.params.fieldId);
        result.json(field);
    }

    function deleteFieldFromForm(request,result){
        var forms = formModel.deleteFieldFromForm(request.params.formId,request.params.fieldId);
        result.json(forms);
    }

    function updateField(request,result){
        var forms = formModel.updateField(request.params.formId,request.params.fieldId,request.body);
        result.json(forms);
    }
};
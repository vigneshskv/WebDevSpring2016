"use strict";

(function() {
    angular
        .module("FormBuilderApp")
        .controller("FieldController", FieldController);

    function FieldController($scope,$rootScope, FormService,FieldService,$routeParams){
        var userId = $rootScope.currentUser._id;
        var formId = $routeParams.formId;

        FormService.findFormById(formId)
            .then(function (form){
                    $scope.form = form.data;
                },
                function (err){

                });

        FieldService.getFieldsForForm(formId)
            .then(function (formFields){
                    $scope.fields = formFields.data;
                },
                function(err){

                });

        $scope.addField=addField;
        $scope.removeField=removeField;
        $scope.updateField=updateField;
        $scope.showField=showField;

        var fieldTypes = [
            //Single Line Text Field
            {"_id": null, "label": "New Text Field", "type": "TEXT", "placeholder": "New Field"},
            //Multi Line Text Field
            {"_id": null, "label": "New Text Field", "type": "TEXTAREA", "placeholder": "New Field"},
            //Date Field
            {"_id": null, "label": "New Date Field", "type": "DATE"},
            //DropDown Field
            {"_id": null, "label": "New Dropdown", "type": "OPTIONS", "options": [
                {"label": "Option 1", "value": "OPTION_1"},
                {"label": "Option 2", "value": "OPTION_2"},
                {"label": "Option 3", "value": "OPTION_3"}
            ]},
            //Checkboxes Field
            {"_id": null, "label": "New Checkboxes", "type": "CHECKBOXES", "options": [
                {"label": "Option A", "value": "OPTION_A"},
                {"label": "Option B", "value": "OPTION_B"},
                {"label": "Option C", "value": "OPTION_C"}
            ]},
            //Radio Buttons Field
            {"_id": null, "label": "New Radio Buttons", "type": "RADIOS", "options": [
                {"label": "Option X", "value": "OPTION_X"},
                {"label": "Option Y", "value": "OPTION_Y"},
                {"label": "Option Z", "value": "OPTION_Z"}
            ]}
        ];

        function addField(fieldTypeIndex){
            if (fieldTypeIndex) {
                FieldService.createFieldForForm(formId,fieldTypes[fieldTypeIndex])
                    .then(function (userFields){
                            $scope.fields = userFields.data;
                        },
                        function (err){

                        });
            }
        }

        function removeField(field){
            FieldService.deleteFieldFromForm(formId,field._id)
                .then(function (userFields){
                        $scope.fields = userFields.data;
                    },
                    function (err){

                    });
        }

        function showField(formField){
            var field = formField;
            var  fieldLocal={
                _id:field._id,
                label:field.label,
                type:field.type,
                placeholder:field.placeholder
            };
            var modaloptions=[];
            var optionsLocal = field.options;
            if(field.type == "OPTIONS" || field.type== "CHECKBOXES" || field.type== "RADIOS"){
                for(var i in optionsLocal){
                    var option = optionsLocal[i].label+ ":"+optionsLocal[i].value+"\n";
                    modaloptions.push(option);
                }
                fieldLocal.options = modaloptions.join("");
            }
            $scope.modal = fieldLocal;
        }

        function updateField(field){
            var options = [];
            if(field.type== "CHECKBOXES"|| field.type== "RADIOS"|| field.type == "DROPDOWN"|| field.type == "OPTIONS"){
                var fieldOptions = field.options.split("\n");
                for(var option in fieldOptions){
                    var optionField = fieldOptions[option].split(":");
                    if(optionField[0] != ""){
                        options.push({
                            "label":optionField[0],
                            "value":optionField[1]
                        });
                    }
                }
                field.options = options;
            }

            FieldService.updateField(formId,field._id,field)
                .then(function (formFields){
                        $scope.fields = formFields.data;
                    },
                    function (err){

                    });
        }
    }
})();
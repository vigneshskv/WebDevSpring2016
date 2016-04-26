module.exports = function (app,db,mongoose){

    var userModel = require("./models/user.model.js")(db,mongoose);

    var FormSchema = require("./models/form.schema.server.js")(mongoose);
    var FormModel =  mongoose.model('form',FormSchema);
    var formModel = require("./models/form.model.js")(db,mongoose,FormModel);

    var FieldSchema = require("./models/field.schema.server.js")(mongoose);
    var FieldModel =  mongoose.model('field',FieldSchema);
    var fieldModel = require("./models/field.model.js") (db,mongoose,FormModel,FieldModel);

    var userService  = require("./services/user.service.server.js")(app, userModel);
    var formService  = require("./services/form.service.server.js")(app,formModel);
    var fieldService = require("./services/field.service.server.js")(app,fieldModel);
};
"use strict";
module.exports = function(app,db,mongoose,passport){

    var userModel = require("./models/user.model.js")(app, db, mongoose, passport);
    //var breUserSchema = require("./models/user.model.js")(db, mongoose);
    //var formModel = require("./models/form.model.js")(db, mongoose);
    //var userSchema = require("./models/user.schema.js")();
    require("./services/server.user.service.js")(app, userModel,mongoose,passport);
    require("./services/server.friend.service.js")(app, userModel,mongoose,passport);
    require("./services/server.restuarant.service.js")(app, userModel,mongoose,passport);
};
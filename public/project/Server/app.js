"use strict";
module.exports = function(app,db,mongoose,passport){

    var userModel = require("./models/user.model.js")(app, db, mongoose, passport);

    require("./services/server.user.service.js")(app, userModel,mongoose,passport);
    require("./services/server.friend.service.js")(app, userModel,mongoose,passport);
    require("./services/server.restuarant.service.js")(app, userModel,mongoose,passport);
};
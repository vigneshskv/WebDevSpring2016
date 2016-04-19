"use strict";
module.exports = function(app, model, mongoose, passport){

    var LocalStrategy = require('passport-local').Strategy;

    app.post("/api/user", CreateUser);
    app.get("/api/user", FindAllUsers);
    app.get("/api/user/:id", FindUserById);
    app.put("/api/user/:id", UpdateUserById);
    app.delete("/api/user/:id", RemoveUserByID);

    app.post("/api/login", passport.authenticate('local'), loginUser);
    app.post("/api/logout", logOutUser);
    app.get("/api/loggedin", loggedIn);


    function CreateUser(req,res){
        var user = req.body;
        model.CreateNewUser(user)
            .then(function (userReturned) {
                res.json(userReturned);
            });
    }


    function FindAllUsers(req,res){
        var username = req.query.username;
        var password = req.query.password;

        var count = 0;
        if(username!= null && password!=null){
            var credentials = {
                username: username,
                password: password
            };

            var user = model.findUserByCredentials(credentials)
                .then(function (userReturned) {
                    res.json(userReturned);
                });
            return;
        }
        else if(password == null  && username != null){
            model.findUserByUsername(username)
                .then(function (user) {
                    res.json(user);
                });
            return;
        }

        var users = model.FindAll()
            .then(function (users) {
                res.json(users);
            });
    }


    function FindUserById(req,res){
        var userId = req.params.id;
        model.FindById(userId)
            .then(function (user) {
                res.json(user);
            },function(err){
                res.status(400).send(err);
            });
    }


    function UpdateUserById(req, res){
        var user = req.body;
        var userId = req.params.id;
        model.Update(userId, user)
            .then(function (user) {
                //console.log(user);
                res.json(user);
            });
    }


    function RemoveUserByID(req, res){
        var userId = req.params.id;
        model.Delete(userId)
            .then(function (user) {
                res.json(user);
            });
    }


    // PassportJD functions
    function loggedIn(req, res){
        res.send(req.isAuthenticated() ? req.user : '0');
    }


    function logOutUser(req, res){
        req.logOut();
        res.send(200);
    }

    passport.use(new LocalStrategy(
        function(username, password, done)
        {
            var credentials = {username: username, password: password};
            model
                .findUserByCredentials(credentials)
                .then(function(user){
                    if(!user)
                        return done(null, false);
                    return done(null, user);
                }, function(err){
                    return done(err);
                });
        }
    ));


    function loginUser(req,res, info){
        var user = req.user;
        res.json(user);
    }


    passport.serializeUser(function(user,done){
        done(null, user);
    });


    passport.deserializeUser(function(user,done){
        model
            .FindById(user._id)
            .then(function(user){
                done(null, user);
            }, function(err){
                done(err);
            });
    });


    var auth = function (req, res, next) {
        if(!req.isAuthenticated())
            res.send(401);
        else
            next();
    };
};
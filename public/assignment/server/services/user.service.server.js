var passport      = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require("bcrypt-nodejs");


module.exports = function (app, userModel){
    var auth = authenticated;
    var loggedInUser;

    app.get("/api/assignment/user",findUser);
    app.get("/api/assignment/user/:id",findUserById);
    app.put("/api/assignment/user/:id", updateProfileUser);
    app.delete("/api/assignment/user/:id", deleteUser);

    app.post("/api/assignment/admin/user",       isAdmin,                  createUser);
    app.get('/api/assignment/admin/user',        isAdmin,                  findAllUsers);
    app.get('/api/assignment/admin/user/:id',    isAdmin,                  findUserById);
    app.delete('/api/assignment/admin/user/:id', isAdmin,                  deleteUser);
    app.put("/api/assignment/admin/user/:id",    isAdmin,                  updateUser);

    passport.use('assignment',   new LocalStrategy(assignmentLocalStrategy));
    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);

    app.post  ('/api/assignment/login',    passport.authenticate('assignment'), assignmentLogin);
    app.post  ('/api/assignment/logout',   assignmentLogout);
    app.get   ('/api/assignment/loggedin', assignmentLoggedin);
    app.post  ('/api/assignment/register', assignmentRegister);


    function assignmentLocalStrategy(username, password, done) {
        userModel
            .findUserByUsername(username)
            .then(
                function (user) {
                    console.log("Inside local strategy");
                    console.log(user);
                    if (user && bcrypt.compareSync(password, user.password)) {
                        return done(null, user);
                    }
                    return done(null, false);
                },
                function (err) {
                    if (err) {
                        return done(err);
                    }
                }
            );
    }


    function serializeUser(user, done) {
        delete user.password;
        done(null, user);
    }

    function deserializeUser(user, done) {
        if(user.type == 'assignment'){
            userModel
                .findUserById(user._id)
                .then(
                    function (user) {
                        delete user.password;
                        done(null, user);
                    },
                    function (err) {
                        done(err, null);
                    }
                );

        }else if(user.type == "project"){
            projectModel
                .findUserById(user._id)
                .then(
                    function (user) {
                        delete user.password;
                        done(null, user);
                    },
                    function (err) {
                        done(err, null);
                    }
                );

        }

    }

    function authenticated(req, res, next) {
        if (!req.isAuthenticated()) {
            res.send(401);
        } else {
            next();
        }
    }

    function assignmentLogin(req, res) {
        var user = req.user;
        loggedInUser = user;
        res.json(user);
    }


    function assignmentLoggedin(req, res) {
        res.send(req.isAuthenticated() ? req.user : '0');
    }


    function assignmentLogout(req, res) {
        req.logOut();
        res.send(200);
    }


    function isAdmin(req,res,next) {
        if(req.isAuthenticated()) {
            if(loggedInUser === undefined) {
                loggedInUser = req.user;
            }
            if(loggedInUser.roles.indexOf("admin") >= 0 || loggedInUser[0].roles.indexOf("admin") >= 0) {
                next();
            }

            else {
                res.send(403);
            }
        }
    }

    function findAllUsers(req, res) {
        userModel
            .findAllUsers()
            .then(
                function (users) {
                    res.json(users);
                },
                function () {
                    res.status(400).send(err);
                }
            );

    }

    function assignmentRegister(req,res){
        var newUser = req.body;
        newUser.roles = ['student'];

        for(var i in newUser.emails){
            newUser.emails[i]=newUser.emails[i].trim();
        }

        userModel.findUserByUsername(newUser.username)
            .then(
                function (user) {
                    if (user) {
                        res.json(null);
                    } else {
                        newUser.password = bcrypt.hashSync(newUser.password);
                        return userModel.createUser(newUser);
                    }
                },
                function (err) {
                    res.status(400).send(err);
                }
            )
            .then(
                function (user) {
                    if (user) {
                        req.login(user, function (err) {
                            if (err) {
                                res.status(400).send(err);
                            } else {
                                loggedInUser = user;
                                res.json(user);
                            }
                        });
                    }
                },
                function (err) {
                    res.status(400).send(err);
                }
            );

    }

    function createUser(req, res) {
        var newUser = req.body;
        if (newUser.roles && newUser.roles.length > 1) {
            newUser.roles = newUser.roles.split(",");
        } else {
            newUser.roles = ["student"];
        }

        userModel.findUserByUsername(newUser.username)
            .then(
                function (user) {
                    if (user == null) {
                        return userModel.createUser(newUser)
                            .then(
                                function (user) {
                                    console.log("model create user");
                                    return userModel.findAllUsers();
                                },
                                function (err) {
                                    console.log("error");
                                    res.status(400).send(err);
                                }
                            );

                    } else {
                        return userModel.findAllUsers();
                    }
                },
                function (err) {
                    res.status(400).send(err);
                }
            )
            .then(
                function (users) {
                    res.json(users);
                },
                function () {
                    res.status(400).send(err);
                }
            )
    }

    function updateUser(req,res){
        var newUser = req.body;

        if (typeof newUser.roles == "string") {
            newUser.roles = newUser.roles.split(",");
        }
        for(var i in newUser.roles){
            newUser.roles[i]=newUser.roles[i].trim();
        }
        for(var i in newUser.emails){
            newUser.emails[i]=newUser.emails[i].trim();
        }

        newUser.password = bcrypt.hashSync(newUser.password);

        userModel
            .updateUser(req.params.id, newUser)
            .then(
                function (user) {
                    return userModel.findAllUsers();

                },
                function (err) {
                    res.status(400).send(err);
                }
            )
            .then(
                function (users) {
                    res.json(users);
                },
                function (err) {
                    console.log(err);
                    res.status(400).send(err);
                }
            );
    }


    function updateProfileUser(req,res){
        var newUser = req.body;

        if (typeof newUser.roles == "string") {
            newUser.roles = newUser.roles.split(",");
        }
        for(var i in newUser.roles){
            newUser.roles[i]=newUser.roles[i].trim();
        }
        for(var i in newUser.emails){
            newUser.emails[i]=newUser.emails[i].trim();
        }

        newUser.password = bcrypt.hashSync(newUser.password);

        userModel
            .updateUser(req.params.id, newUser)
            .then(
                function (user) {
                    return userModel.findUserById(req.params.id)
                },
                function (err) {
                    res.status(400).send(err);
                }
            )
            .then(
                function (user) {

                    if (user) {
                        req.login(user, function (err) {
                            if (err) {
                                res.status(400).send(err);
                            } else {
                                loggedInUser = user;
                                res.json(user);
                            }
                        });
                    }
                },
                function (err) {
                    console.log(err);
                    res.status(400).send(err);
                }
            );
    }

    function deleteUser(req,res){
        userModel.deleteUser(req.params.id)
            .then(
                function (user) {
                    return userModel.findAllUsers();
                },
                function (err) {
                    res.status(400).send(err);
                }
            )
            .then(
                function (users) {
                    res.json(users);
                },
                function (err) {
                    res.status(400).send(err);
                }
            );
    }

    function findUserById(req, res) {
        var userId = req.params.id;
        var userResponse = userModel.findUserById(userId)
            .then(
                function(doc) {
                    res.json(doc);
                },
                function(err) {
                    res.status(400).send(err);
                }
            );
    }


    function findUser(req,res){
        var userName = req.query.username;
        var password = req.query.password;
        var user = null;
        if (userName != null && password != null){
            var credentials = {username : userName, password : password};
            userModel.findUserByCredentials(credentials)
                .then( function(user){
                        res.json(user);
                    },
                    function(err){
                        res.status(400).send(err);
                    }
                );
        }
        if(userName!=null && password == null){
            userModel.findUserByUsername(userName)
                .then(
                    function(doc) {
                        res.json(doc);
                    },
                    function ( err ) {
                        res.status(400).send(err);
                    });
        }
        if(userName ==null && password == null){
            var users = userModel.findAllUsers();
            res.json(users);
        }
    }
};
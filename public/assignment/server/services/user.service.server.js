module.exports = function (app, userModel){

    app.post("/api/assignment/user",createUser);
    app.get("/api/assignment/user",findUser);
    app.get("/api/assignment/user/:id",findUserById);
    app.put("/api/assignment/user/:id", updateUser);
    app.delete("/api/assignment/user/:id", deleteUser);


    function createUser(req,res){
        var user = req.body;
        console.log("req body in web service:"+JSON.stringify(req.body));
        userModel.createUser(user)
            .then(
                function (doc) {
                    console.log("Inside user web service");
                    console.log(JSON.stringify(doc));
                    //req.session.currentUser = doc;
                    res.json(doc);
                },
                function ( err ) {
                    res.status(400).send(err);
                });

    }

    function updateUser(req,res){
        userModel.updateUser(req.body,req.params.id)
            .then( function(updatedUser){
                    res.json(updatedUser);
                },
                function(err){
                    res.status(400).send(err);
                }
            );
    }

    function deleteUser(req,res){
        var users = userModel.deleteUser(req.params.id);
        res.json(users);
    }

    function findUserById(req,res){
        var user = userModel.findUserById(req.params.id);
        res.json(user);
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
                //res.json(user);
                // handle model promise
                .then(
                    // login user if promise resolved
                    function(doc) {
                        console.log("Inside user web service findByUsername");
                        console.log(JSON.stringify(doc));
                        res.json(doc);
                    },
                    // send error if promise rejected
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
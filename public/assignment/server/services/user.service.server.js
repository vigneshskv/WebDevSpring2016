module.exports = function (app, userModel){

    app.post("/api/assignment/user",createUser);
    app.get("/api/assignment/user",findAllUsers);
    app.get("/api/assignment/user/:id",findUserById);
    app.get("/api/assignment/user?username=username",findUserByUsername);
    app.get("/api/assignment/user?username=alice&password=wonderland",findUserByCredentials);
    app.put("/api/assignment/user/:id", updateUser);
    app.delete("/api/assignment/user/:id", deleteUser);


    function createUser(req,res){
        var newUsers = userModel.createUser(req.body);
        res.json(newUsers);
    }

    function updateUser(req,res){
        var updatedUsers = userModel.updateUser(req.body,req.params.id);
        if (updatedUsers != null){
            res.json(updatedUsers);
        }
        else{
            res.json({message: "Cannot Update"});
        }
    }

    function deleteUser(req,res){
        var users = userModel.deleteUser(req.params.id);
        if(users != null){
            res.json(users);
        }
        else{
            res.json({message: "Cannot Delete"});
        }
    }

    function userResponse(user){
        if(user != null){
            res.json(user);
        }
        else{
            res.json({message: "Cannot find user"});
        }
    }

    function findUserById(req,res){
        var user = userModel.findUserById(req.params.id);
        userResponse(user);
    }

    function findAllUsers(req,res){
        var users = userModel.findAllUsers();
        res.json(users);
    }

    function findUserByUsername(req,res){
        var userName = req.query.username;
        var user = userModel.findUserByUsername(userName);
        userResponse(user);
    }

    function findUserByCredentials(req,res){
        var userName = req.query.username;
        var password = req.query.password;
        var credentials = {username : userName, password : password};
        var user = userModel.findUserByCredentials(credentials);
        userResponse(user);
    }
};

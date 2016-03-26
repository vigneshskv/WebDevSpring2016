module.exports = function (app, userModel){
    app.post("/api/assignment/user",createUser);
    app.get("/api/assignment/user",findUser);
    app.get("/api/assignment/user/:id",findUserById);
    app.put("/api/assignment/user/:id", updateUser);
    app.delete("/api/assignment/user/:id", deleteUser);

    function createUser(request,result){
        var newUsers = userModel.createUser(request.body);
        result.json(newUsers);
    }

    function updateUser(request,result){
        var updatedUser = userModel.updateUser(request.body,request.params.id);
        result.json(updatedUser);
    }

    function deleteUser(request,result){
        var users = userModel.deleteUser(request.params.id);
        result.json(users);
    }

    function findUserById(request,result){
        var user = userModel.findUserById(request.params.id);
        result.json(user);
    }

    function findUser(request,result){
        var userName = request.query.username;
        var password = request.query.password;
        var user = null;
        if (userName != null && password != null){
            var credentials = {username : userName, password : password};
            user = userModel.findUserByCredentials(credentials);
            result.json(user);
        }
        if(userName!=null && password == null){
            user = userModel.findUserByUsername(userName);
            result.json(user);
        }
        if(userName ==null && password == null){
            var users = userModel.findAllUsers();
            result.json(users);
        }
    }
};
module.exports = function(app) {
    var users = require("./user.mock.json");

    var api = {
        createUser:createUser,
        updateUser:updateUser,
        deleteUser:deleteUser,
        findAllUsers:findAllUsers,
        findUserById:findUserById,
        findUserByUsername:findUserByUsername,
        findUserByCredentials:findUserByCredentials
    };

    return api;

    // creates a new user JSON object and adds to existing users list
    function createUser(user){
        //create new JSON object of given user details
        var newUser = {
            _id : (new Date).getTime(),
            username :  user.username,
            password : user.password,
            email: user.email
        };
        // add temporary user to userlist
        users.push(newUser);
        return users;
    }

    function updateUser(user, userId){
        for(var i in users){
            if(users[i]._id == userId){
                users[i].firstName = user.firstName;
                users[i].lastName = user.lastName;
                users[i].username = user.username;
                users[i].password = user.password;
                users[i].email = user.email;
                return users[i];
            }
        }
        return null;
    }

    function deleteUser(userId){
        var user = findUserById(userId);
        if(user != null){
            users.splice(user,1);
            return users;
        }
        else{
            return null;
        }
    }

    function findAllUsers(){
        return users;
    }

    function findUserById(userId){
        for(var i in users)
            if(users[i]._id == userId)
                return users[i];
        return null;
    }


    function findUserByUsername(userName){
        for(var i in users)
            if(users[i].username == userName)
                return users[i];
        return null;
    }

    function findUserByCredentials(credentials){
        for (var i in users)
            if(users[i].username == credentials.username && users[i].password == credentials.password)
                return users[i];
        return null;
    }
};
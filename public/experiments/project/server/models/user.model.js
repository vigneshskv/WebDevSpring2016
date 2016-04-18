"use strict";
var q = require("q");

module.exports = function(db,mongoose) {
    var UserSchema = require("./user.schema.server.js")(mongoose);
    var UserModel = mongoose.model('user',UserSchema);

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

    function findUserByUsername(userName){
        var deferred = q.defer();

        UserModel.findOne(
            {username: userName},

            function(err, doc) {
                if (err)
                    deferred.reject(err);
                else
                    deferred.resolve(doc);
            });
        return deferred.promise;
    }

    function createUser(user){
        var deferred = q.defer();

        UserModel.create(user, function (err, doc) {
            if(err)
                deferred.reject(err);
            else
                deferred.resolve(doc);
        });
        return deferred.promise;
    }

    function updateUser(user, userId){
        var deferred = q.defer();

        UserModel.findById({_id:userId}, function(err,userFound){
            if(err)
                deferred.reject(err);
            else{
                userFound.username = user.username;
                userFound.firstName = user.firstName;
                userFound.lastName = user.lastName;
                userFound.password = user.password;
                userFound.email = user.email;
                userFound.phones = user.phones;
                userFound.save(function(err,userUpdated){
                    if(err)
                        deferred.reject(err);
                    else
                        deferred.resolve(userUpdated);
                });
            }
        });
        return deferred.promise;
    }

    function findAllUsers(){
        return users;
    }

    function deleteUser(userId){
        var user = findUserById(userId);
        if(user != null){
            users.splice(user,1);
            return users;
        }
        else
            return null;
    }

    function findUserById(userId){
        for(var i in users)
            if(users[i]._id == userId)
                return users[i];
        return null;
    }

    function findUserByCredentials(credentials){
        var deferred = q.defer();
        UserModel.findOne(

            { username: credentials.username,
                password: credentials.password },

            function(err, doc) {
                if (err)
                    deferred.reject(err);
                else
                    deferred.resolve(doc);
            });
        return deferred.promise;
    }
};
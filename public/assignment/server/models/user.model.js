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

    function createUser(user){
        var deferred = q.defer();
        UserModel.create(user, function (err, doc) {
            if(err){
                deferred.reject(err);
            }else{
                deferred.resolve(doc);
            }
        });

        return deferred.promise;
    }

    function updateUser(userId, user){
        console.log(user);
        var deferred = q.defer();

        UserModel.findById({_id: userId}, function(err,userFound){
            if(err){
                deferred.reject(err);
            }
            else{
                userFound.username = user.username;
                userFound.firstName = user.firstName;
                userFound.lastName = user.lastName;
                userFound.password = user.password;
                userFound.email = user.email;
                userFound.phones = user.phones;
                userFound.roles = user.roles;
                userFound.type = user.type;
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

    function deleteUser(userId){
        var deferred = q.defer();
        UserModel.remove({_id : userId}, function (err, doc) {
            if (err)
                deferred.reject(err);
            else {
                console.log("user deleted");
                deferred.resolve(doc);
            }
        });
        return deferred.promise;
    }

    function findAllUsers() {
        var deferred = q.defer();
        UserModel.find(function (err, doc) {
            if (err)
                deferred.reject(err);
            else
                deferred.resolve(doc)
        });
        return deferred.promise;
    }



    function findUserById(userId) {
        var deferred = q.defer();
        UserModel.findById({_id : userId}, function (err, doc) {
            if (err)
                deferred.reject(err);
            else
                deferred.resolve(doc);
        });
        return deferred.promise;
    }


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
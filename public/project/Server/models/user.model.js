
module.exports = function(app, db, mongoose, passport){

    var q  = require("q");
    //var flow = require("finally");
    var uaUserSchema               = require("./schemas/user.schema.js")(mongoose);
    var uaUserModel                = mongoose.model("uaUserModel",uaUserSchema);

    //user Friend Schema
    var uaUserFriendsSchema        = require("./schemas/user.friends.schema.js")(mongoose);
    var uaUserFriendsModel         = mongoose.model("uaUserFriendsModel",uaUserFriendsSchema);

    //Restaurant Details Schema
    var uaRestaurantSchema               = require("./schemas/restaurant.schema.js")(mongoose);
    var uaRestuarantModel                = mongoose.model("uaRestuarantModel",uaRestaurantSchema);

    //Book Fav
    var uaRestaurantFavSchema            = require("./schemas/restaurant.fav.schema.js")(mongoose);
    var uaRestaurantFavModel             = mongoose.model("uaRestaurantFavModel", uaRestaurantFavSchema);

    //Book Review
    var uaRestaurantReviewSchema         = require("./schemas/restaurant.review.schema.js")(mongoose);
    var uaRestaurantReviewModel          = mongoose.model("uaRestaurantReviewModel", uaRestaurantReviewSchema);

    var api = {
        CreateNewUser                   : CreateNewUser,
        FindAll                         : FindAll,
        FindById                        : FindById,
        findUserByUsername              : findUserByUsername,
        Update                          : Update,
        Delete                          : Delete,
        findUserByCredentials           : findUserByCredentials,

        //userFriends Functions
        AddFriendForUserId              : AddFriendForUserId,
        findFriendsAndFollowersForId    : findFriendsAndFollowersForId,
        RemoveFriendorFollower          : RemoveFriendorFollower,

        //User Book Functions
        addFavRestaurantForUser               : addFavRestaurantForUser,
        RemoveFavRestaurantForUser            : RemoveFavRestaurantForUser,
        GetFavRestaurantsForCurrentUser       : GetFavRestaurantsForCurrentUser,
        SubmitReview                    : SubmitReview,
        GetReviewsForRestaurantID           : GetReviewsForRestaurantID,
        GetReviewsByUserId              : GetReviewsByUserId,
        GetRestaurantObjectById               : GetRestaurantObjectById
    };
    return api;

    function CreateNewUser(user){
        console.log("USER MODEL CREATE USER START");
        //console.log(user);
        var deferred = q.defer();
        var finalResult={};
        uaUserModel.create(user, function(err, newUser){
            if(err){
                console.log(err);
                deferred.reject(err);
            } else {
                //TODO, resolve both user obj and user friend obj to verify
                //console.log("USER MODEL: CREATED USER");
                //console.log(newUser);
                finalResult.user = newUser;
                uaUserFriendsModel.create({userId: newUser._id, friends: [], followers: []},
                    function(err, friendResult){
                        if(err){
                            console.log(err);
                            deferred.reject(err);
                        }else {
                            //console.log(friendResult);
                            finalResult.friend = friendResult;
                            uaRestaurantFavModel.create({userId: newUser._id, bookIds: []},
                                function(err, bookFavObj){
                                    if(err){
                                        console.log(err);
                                        deferred.reject(err);
                                    }else{
                                        finalResult.bookFav = bookFavObj;
                                        console.log("USER MODEL CREATE END");
                                        deferred.resolve(finalResult);
                                    }
                                });
                        }
                    });
            }
        });
        return deferred.promise;
    }

    function FindAll(){
        //console.log("findall called");
        var deferred = q.defer();
        uaUserModel.find(function(err,result){
            if(err){
                deferred.reject(null);
            } else {
                deferred.resolve(result);
            }
        });
        return deferred.promise;
    }

    function FindById(id){
        var deferred = q.defer();
        //console.log("USER MODEL: findbyID called "+ id);
        uaUserModel.findById(id,
            function(err,result){
                if(err){
                    deferred.reject(err);
                } else {
                    deferred.resolve(result);
                }
            });
        return deferred.promise;
    }

    function findUserByUsername(username){
        var deferred = q.defer();
        uaUserModel.findOne({username: username},
            function(err,result){
                if(err){
                    deferred.reject(null);
                } else {
                    deferred.resolve(result);
                }
            });
        return deferred.promise;
    }

    function Update(userId, user){
        var deferred = q.defer();

        delete user._id;
        uaUserModel.update({_id: userId}, {$set: user},
            function(err,result){
                if(err){
                    deferred.resolve(err);
                }else{
                    deferred.resolve(result);
                }
            });
        return deferred.promise;
    }

    function Delete(userId){
        var deferred = q.defer();
        uaUserModel.remove({_id:userId},
            function(err,result){
                if(err){
                    deferred.reject(null);
                } else {
                    //console.log(result);
                    deferred.resolve(result);
                }
            });
        return deferred.promise;
    }

    function findUserByCredentials(credentials){
        var deferred = q.defer();
        var username = credentials.username;
        var password = credentials.password;
        uaUserModel.findOne({username: username, password: password},
            function(err,result){
                if(err){
                    deferred.reject(err);
                } else {
                    //console.log(result);
                    deferred.resolve(result);
                }
            });

        return deferred.promise;
    }
    //----------------------------------------------------
    function AddFriendForUserId(userId, friendId){
        console.log("SERVER USER MODEL: Adding user"+friendId+" as friend to "+userId);
        //return "Hello";
        //  x adds y as friend

        var deferred = q.defer();
        // add y to x's friend list
        uaUserFriendsModel.findOne({userId: userId},
            function(err,result){
                uaUserFriendsModel.findOne({userId: userId},
                    function(err, userObj){
                        userObj.friends.push(friendId);
                        userObj.save(function(err,result){
                            //console.log(result);
                        });
                    });
                uaUserFriendsModel.findOne({userId: friendId},
                    function(err, userObj){
                        //console.log("user's friend has followers, updating now");
                        userObj.followers.push(userId);
                        userObj.save(function(err,result){
                            //TODO, resolve both user obj and user friend obj to verify
                            deferred.resolve(result);
                        });
                    });
            });
        return deferred.promise;
    }

    function findFriendsAndFollowersForId(userId) {
        var deferred = q.defer();

        var finalRes = {};
        uaUserFriendsModel.findOne({userId: userId},
            function (err, user) {
                uaUserModel.find({$or: [ {_id : {$in: user.friends}} ]},
                    function(err, friends){
                        if(err){
                            deferred.reject(err);
                        }
                        else {
                            finalRes.friends = friends;
                            uaUserModel.find({$or: [{_id: {$in: user.followers}}]},
                                function(err, followers){
                                    if(err){
                                        deferred.reject(err);
                                    }
                                    else{
                                        finalRes.followers = followers;
                                        deferred.resolve(finalRes);
                                    }
                                });
                        }
                    });
            });
        return deferred.promise;
    }

    function RemoveFriendorFollower(userId, friendId){
        var deferred = q.defer();
        uaUserFriendsModel.findOne({userId: userId},
            function( err, user){
                if(err){
                    deferred.reject(err);
                }else{
                    user.friends.splice(user.friends.indexOf(friendId),1);
                    user.save(function(err, friends){
                        if(err){
                            deferred.reject(err);
                        }else{
                            // remove userId from friend's Obj
                            uaUserFriendsModel.findOne({userId: friendId},
                                function(err, friendUser){
                                    if(err){
                                        deferred.reject(err);
                                    }else{
                                        // remove userId from friendUser's followers
                                        friendUser.followers.splice(friendUser.followers.indexOf(userId),1);
                                        friendUser.save(function(err, result){
                                            if(err){
                                                deferred.reject(err);
                                            }else{
                                                deferred.resolve(result);
                                            }
                                        });
                                    }
                                });
                        }
                    });
                }
            });
        return deferred.promise;
    }
    //----------------------------------------------------

    function addFavRestaurantForUser(userId, book){
        var deferred = q.defer();
        console.log("Entering adding favorite book for user");
        uaRestaurantFavModel.findOne({userId: userId},
            function(err, favBookObj){
                if(err){
                    deferred.reject(err);
                }
                else{
                    //console.log("-------favBookObj---------");
                    //console.log(favBookObj);
                    //console.log("----------Book ID --------");
                    var bookId = book.id;
                    //console.log(bookId);
                    //console.log(favBookObj.bookIds.indexOf(bookId));
                    if(favBookObj.bookIds.indexOf(bookId) == -1 ) {
                        //console.log("user fav does not have the book, adding now");
                        favBookObj.bookIds.push(book.id);
                        favBookObj.save(function (err, favBookAddedObj) {
                            if (err) {
                                deferred.reject(err);
                            } else {
                                // add the book to bookDetails schema
                                // the argument zero is dummy value
                                StoreBookDetails(book,0);
                                deferred.resolve(favBookAddedObj);
                            }
                        })
                    }
                    else{
                        deferred.resolve(null);
                    }
                }
            });
        return deferred.promise;
    }

    function RemoveFavRestaurantForUser(userId, bookId){
        var deferred = q.defer();

        uaRestaurantFavModel.findOne({userId: userId},
            function(err, userFavObj){
                if(err){
                    deferred.reject(err);
                }
                else {
                    userFavObj.bookIds.splice(userFavObj.bookIds.indexOf(bookId), 1);
                    userFavObj.save(function (err, userFavObj) {
                        if (err) {
                            deferred.reject(err);
                        }
                        else {
                            deferred.resolve(userFavObj);
                        }
                    });
                }
            });
        return deferred.promise;
    }

    function GetFavRestaurantsForCurrentUser(userId){
        var deferred = q.defer();
        uaRestaurantFavModel.findOne({userId: userId},
            function(err, favBookObj){

                if(err){
                    deferred.reject(err);
                }
                else{
                    if(favBookObj.bookIds == 0){
                        deferred.resolve(null);
                    }
                    /*console.log("user found");
                     console.log(favBookObj);*/
                    uaRestuarantModel.find({$or: [{ISBN_13: {$in: favBookObj.bookIds}}]},
                        function(err, favBooks){
                            if(err){
                                deferred.reject(err);
                            }
                            else
                            {
                                console.log("favBooks");
                                console.log(favBooks);
                                deferred.resolve(favBooks);
                            }
                        });
                }
            });
        return deferred.promise;
    }

    function SubmitReview(userId, reviewObj){
        var deferred = q.defer();
        uaRestaurantReviewModel.create({
                bookId              : reviewObj.bookObj.id,
                userId              : userId,
                username            : reviewObj.username,
                reviewDesc          : reviewObj.review,
                sentimentRating     : reviewObj.centScore
            },
            function(err, result){
                if(err){
                    deferred.reject(err);
                }
                else{
                    reviewObj.bookObj.centScore = reviewObj.centScore;
                    StoreBookDetails(reviewObj.bookObj,1);
                    deferred.resolve(result);
                }
            });
        return deferred.promise;
    }

    function GetReviewsForRestaurantID(bookISBN){
        var deferred = q.defer();

        uaRestaurantReviewModel.find({bookId : bookISBN},
            function(err, result){
                if(err){
                    deferred.reject(err);
                }
                else{
                    //console.log("----USER MDOEL Result for ISBN REVIEWS---");
                    //console.log(result);
                    deferred.resolve(result);
                }
            });
        return deferred.promise;
    }

    function GetReviewsByUserId(userId){
        var deferred = q.defer();
        var bookReviewandDetails = {};
        uaRestaurantReviewModel.find({userId : userId},
            function(err, userReviews){
                if(err){
                    deferred.reject(err);
                }
                else{
                    bookReviewandDetails.reviews = userReviews;
                    var userBookIds = [];
                    for(var i = 0 ; i<userReviews.length; i++){
                        if(userBookIds.indexOf(userReviews[i].bookId) < 0) {
                            userBookIds.push(userReviews[i].bookId);
                        }
                    }
                    uaRestuarantModel.find({$or: [{ISBN_13: {$in : userBookIds}}]},
                        function(err, bookDetails){
                            if(err){
                                deferred.reject(err);
                            }
                            else{
                                bookReviewandDetails.bookDetails = bookDetails;
                                deferred.resolve(bookReviewandDetails);
                            }
                        });
                }
            });
        return deferred.promise;
    }

    function GetRestaurantObjectById(bookId){
        var deferred = q.defer();

        uaRestuarantModel.findOne({ISBN_13 : bookId},
            function(err, result){
                if(err){
                    deferred.reject(err);
                }
                else{
                    //console.log("+++++++++++BOOKOBJ result++++++++");
                    //console.log(result);
                    deferred.resolve(result);
                }
            });
        return deferred.promise;
    }

















    function StoreBookDetails(book, updateFlag){
        console.log("entering storebookdetails");
        console.log(book);
        var deferred = q.defer();
        // check if book exists
        uaRestuarantModel.findOne({ISBN_13: book.id},
            function(err,result){
                if(err){
                    deferred.reject(err);
                }else{
                    if(result != null){
                        console.log("entering storebookdetails IF LOOP");
                        if(updateFlag ==1){
                            var ISBN = book.id;
                            // if book is already present, update the sentiment rating

                            var newcentScore = parseFloat((parseInt(book.centScore) + parseInt(result.sentimentRating))/2);
                            /*console.log("Old Sent Score "+result.sentimentRating);
                            console.log("Review Sent Score "+book.centScore);
                            console.log("new Sent Score "+newcentScore);*/

                            uaRestuarantModel.update({ISBN_13: ISBN}, {sentimentRating : newcentScore},
                                function(err, updateResult){
                                    if(err){
                                        console.log(err);
                                        deferred.reject(err);
                                    }
                                    else{
                                        deferred.resolve(updateResult);
                                    }
                                });
                            //deferred.resolve(1);
                            }
                    }else{
                        console.log("entering storebookdetails ELSE LOOP");
                        console.log(book.rating_img_url);
                        /*console.log("book details not present, adding");
                        console.log(book.volumeInfo.averageRating);*/

                        var avgRating = "//placehold.it/10x10";
                        if(book.rating_img_url){
                            console.log("avg rating present updating");
                            avgRating = book.rating_img_url;
                            console.log("Vigfnesh"+avgRating);
                        }
                        var imageUrl = "//placehold.it/100x100";
                        if(book.image_url)
                        {
                            imageUrl = book.image_url;
                        }


                        uaRestuarantModel.create({
                            ISBN_13             : book.id,
                            title               : book.name,
                            //authors             : book.volumeInfo.authors,
                            thumbnailUrl        : imageUrl,
                            description         : book.snippet_text,
                            googlePreviewLink   : book.url,
                            //breViewRating       : book.volumeInfo.averageRating,
                            sentimentRating     : avgRating
                        },function(err,bookObj){
                            if(err){
                                deferred.reject("err adding book");
                                deferred.reject(err);
                            }else{
                                //console.log("bookObj");
                                //console.log(bookObj);
                                deferred.resolve(1);
                            }
                        });
                    }
                }
            })
        return deferred.promise;
    }


























}
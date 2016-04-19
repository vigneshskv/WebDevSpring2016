"use strict";
module.exports = function(app, db, mongoose, passport) {

    var q = require("q");

    var uaUserSchema = require("./schemas/user.schema.js")(mongoose);
    var uaUserModel = mongoose.model("uaUserModel", uaUserSchema);

    //user Friend Schema
    var uaUserFriendsSchema = require("./schemas/user.friends.schema.js")(mongoose);
    var uaUserFriendsModel = mongoose.model("uaUserFriendsModel", uaUserFriendsSchema);

    //Restaurant Details Schema
    var uaRestaurantSchema = require("./schemas/restaurant.schema.js")(mongoose);
    var uaRestuarantModel = mongoose.model("uaRestuarantModel", uaRestaurantSchema);

    //Restaurant Favourite
    var uaRestaurantFavSchema = require("./schemas/restaurant.fav.schema.js")(mongoose);
    var uaRestaurantFavModel = mongoose.model("uaRestaurantFavModel", uaRestaurantFavSchema);

    //Restaurant Review
    var uaRestaurantReviewSchema = require("./schemas/restaurant.review.schema.js")(mongoose);
    var uaRestaurantReviewModel = mongoose.model("uaRestaurantReviewModel", uaRestaurantReviewSchema);

    var api = {
        CreateNewUser: CreateNewUser,
        FindAll: FindAll,
        FindById: FindById,
        findUserByUsername: findUserByUsername,
        Update: Update,
        Delete: Delete,
        findUserByCredentials: findUserByCredentials,

        //userFriends Functions
        AddFriendForUserId: AddFriendForUserId,
        findFriendsAndFollowersForId: findFriendsAndFollowersForId,
        RemoveFriendorFollower: RemoveFriendorFollower,

        //User Restaurant Functions
        addFavRestaurantForUser: addFavRestaurantForUser,
        RemoveFavRestaurantForUser: RemoveFavRestaurantForUser,
        GetFavRestaurantsForCurrentUser: GetFavRestaurantsForCurrentUser,
        SubmitReview: SubmitReview,
        GetReviewsForRestaurantID: GetReviewsForRestaurantID,
        GetReviewsByUserId: GetReviewsByUserId,
        GetRestaurantObjectById: GetRestaurantObjectById
    };
    return api;


    function CreateNewUser(user) {
        var deferred = q.defer();
        var finalResult = {};

        uaUserModel.create(user, function (err, newUser) {
            if (err) {
                console.log(err);
                deferred.reject(err);
            } else {
                finalResult.user = newUser;

                // create empty freinds and followers for new user
                uaUserFriendsModel.create({userId: newUser._id, friends: [], followers: []},
                    function (err, friendResult) {
                        if (err) {
                            console.log(err);
                            deferred.reject(err);
                        } else {
                            finalResult.friend = friendResult;

                            // create empty favourite restaurants for new user
                            uaRestaurantFavModel.create({userId: newUser._id, bookIds: []},
                                function (err, bookFavObj) {
                                    if (err) {
                                        console.log(err);
                                        deferred.reject(err);
                                    } else {
                                        finalResult.bookFav = bookFavObj;
                                        deferred.resolve(finalResult);
                                    }
                                });
                        }
                    });
            }
        });
        return deferred.promise;
    }

    function FindAll() {
        var deferred = q.defer();
        uaUserModel.find(function (err, result) {
            if (err) {
                deferred.reject(null);
            } else {
                deferred.resolve(result);
            }
        });
        return deferred.promise;
    }

    function FindById(id) {
        var deferred = q.defer();
        uaUserModel.findById(id,
            function (err, result) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(result);
                }
            });
        return deferred.promise;
    }

    function findUserByUsername(username) {
        var deferred = q.defer();
        uaUserModel.findOne({username: username},
            function (err, result) {
                if (err) {
                    deferred.reject(null);
                } else {
                    deferred.resolve(result);
                }
            });
        return deferred.promise;
    }

    function Update(userId, user) {
        var deferred = q.defer();

        delete user._id;
        uaUserModel.update({_id: userId}, {$set: user},
            function (err, result) {
                if (err) {
                    deferred.resolve(err);
                } else {
                    deferred.resolve(result);
                }
            });
        return deferred.promise;
    }

    function Delete(userId) {
        var deferred = q.defer();
        uaUserModel.remove({_id: userId},
            function (err, result) {
                if (err) {
                    deferred.reject(null);
                } else {
                    deferred.resolve(result);
                }
            });
        return deferred.promise;
    }

    function findUserByCredentials(credentials) {
        var deferred = q.defer();
        var username = credentials.username;
        var password = credentials.password;
        uaUserModel.findOne({username: username, password: password},
            function (err, result) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(result);
                }
            });

        return deferred.promise;
    }

    //----------------------------------------------------
    function AddFriendForUserId(userId, friendId) {
        console.log("SERVER USER MODEL: Adding user" + friendId + " as friend to " + userId);

        var deferred = q.defer();
        uaUserFriendsModel.findOne({userId: userId},
            function (err, result) {
                uaUserFriendsModel.findOne({userId: userId},
                    function (err, userObj) {
                        userObj.friends.push(friendId);
                        userObj.save(function (err, result) {
                        });
                    });
                uaUserFriendsModel.findOne({userId: friendId},
                    function (err, userObj) {
                        userObj.followers.push(userId);
                        userObj.save(function (err, result) {
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
                uaUserModel.find({$or: [{_id: {$in: user.friends}}]},
                    function (err, friends) {
                        if (err) {
                            deferred.reject(err);
                        }
                        else {
                            finalRes.friends = friends;
                            uaUserModel.find({$or: [{_id: {$in: user.followers}}]},
                                function (err, followers) {
                                    if (err) {
                                        deferred.reject(err);
                                    }
                                    else {
                                        finalRes.followers = followers;
                                        deferred.resolve(finalRes);
                                    }
                                });
                        }
                    });
            });
        return deferred.promise;
    }

    function RemoveFriendorFollower(userId, friendId) {
        var deferred = q.defer();
        uaUserFriendsModel.findOne({userId: userId},
            function (err, user) {
                if (err) {
                    deferred.reject(err);
                } else {
                    user.friends.splice(user.friends.indexOf(friendId), 1);
                    user.save(function (err, friends) {
                        if (err) {
                            deferred.reject(err);
                        } else {
                            uaUserFriendsModel.findOne({userId: friendId},
                                function (err, friendUser) {
                                    if (err) {
                                        deferred.reject(err);
                                    } else {
                                        // remove userId from friendUser's followers
                                        friendUser.followers.splice(friendUser.followers.indexOf(userId), 1);
                                        friendUser.save(function (err, result) {
                                            if (err) {
                                                deferred.reject(err);
                                            } else {
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

    function addFavRestaurantForUser(userId, restaurant) {
        var deferred = q.defer();

        uaRestaurantFavModel.findOne({userId: userId},
            function (err, favRestaurantObj) {
                if (err) {
                    deferred.reject(err);
                }
                else {
                    var bookId = restaurant.id;
                    if (favRestaurantObj.bookIds.indexOf(bookId) == -1) {
                        //console.log("user fav does not have the book, adding now");
                        favRestaurantObj.bookIds.push(restaurant.id);
                        favRestaurantObj.save(function (err, favRestaurantAddedObj) {
                            if (err) {
                                deferred.reject(err);
                            } else {
                                // the argument zero is dummy value
                                StoreRestaurantDetails(restaurant, 0);
                                deferred.resolve(favRestaurantAddedObj);
                            }
                        })
                    }
                    else {
                        deferred.resolve(null);
                    }
                }
            });
        return deferred.promise;
    }

    function RemoveFavRestaurantForUser(userId, restaurantId) {
        var deferred = q.defer();

        uaRestaurantFavModel.findOne({userId: userId},
            function (err, userFavObj) {
                if (err) {
                    deferred.reject(err);
                }
                else {
                    userFavObj.bookIds.splice(userFavObj.bookIds.indexOf(restaurantId), 1);
                    userFavObj.save(function (err, userFavObj) {
                        if (err)
                            deferred.reject(err);
                        else
                            deferred.resolve(userFavObj);
                    });
                }
            });
        return deferred.promise;
    }

    function GetFavRestaurantsForCurrentUser(userId) {
        var deferred = q.defer();
        uaRestaurantFavModel.findOne({userId: userId},
            function (err, favRestaurantObj) {

                if (err) {
                    deferred.reject(err);
                }
                else {
                    if (favRestaurantObj.bookIds == 0) {
                        deferred.resolve(null);
                    }
                    /*console.log("user found");
                     console.log(favBookObj);*/
                    uaRestuarantModel.find({$or: [{ISBN_13: {$in: favRestaurantObj.bookIds}}]},
                        function (err, favRestaurants) {
                            if (err) {
                                deferred.reject(err);
                            }
                            else {
                                console.log("favRestaurants");
                                console.log(favRestaurants);
                                deferred.resolve(favRestaurants);
                            }
                        });
                }
            });
        return deferred.promise;
    }

    function SubmitReview(userId, reviewObj) {
        var deferred = q.defer();
        uaRestaurantReviewModel.create({
                bookId: reviewObj.bookObj.id,
                userId: userId,
                username: reviewObj.username,
                reviewDesc: reviewObj.review,
                sentimentRating: reviewObj.centScore
            },
            function (err, result) {
                if (err) {
                    deferred.reject(err);
                }
                else {
                    reviewObj.bookObj.centScore = reviewObj.centScore;
                    StoreRestaurantDetails(reviewObj.bookObj, 1);
                    deferred.resolve(result);
                }
            });
        return deferred.promise;
    }

    function GetReviewsForRestaurantID(restaurantID) {
        var deferred = q.defer();

        uaRestaurantReviewModel.find({bookId: restaurantID},
            function (err, result) {
                if (err)
                    deferred.reject(err);
                else
                    deferred.resolve(result);

            });
        return deferred.promise;
    }

    function GetReviewsByUserId(userId) {
        var deferred = q.defer();
        var restaurantReviewandDetails = {};
        uaRestaurantReviewModel.find({userId: userId},
            function (err, userReviews) {
                if (err) {
                    deferred.reject(err);
                }
                else {
                    restaurantReviewandDetails.reviews = userReviews;
                    var userRestaurantIds = [];
                    for (var i = 0; i < userReviews.length; i++) {
                        if (userRestaurantIds.indexOf(userReviews[i].bookId) < 0) {
                            userRestaurantIds.push(userReviews[i].bookId);
                        }
                    }
                    uaRestuarantModel.find({$or: [{ISBN_13: {$in: userRestaurantIds}}]},
                        function (err, bookDetails) {
                            if (err) {
                                deferred.reject(err);
                            }
                            else {
                                restaurantReviewandDetails.bookDetails = bookDetails;
                                deferred.resolve(restaurantReviewandDetails);
                            }
                        });
                }
            });
        return deferred.promise;
    }

    function GetRestaurantObjectById(restaurantId) {
        var deferred = q.defer();

        uaRestuarantModel.findOne({ISBN_13: restaurantId},
            function (err, result) {
                if (err)
                    deferred.reject(err);
                else
                    deferred.resolve(result);

            });
        return deferred.promise;
    }

    function StoreRestaurantDetails(restaurant, updateFlag) {
        console.log(restaurant);
        var deferred = q.defer();
        // check if restaurant exists
        uaRestuarantModel.findOne({ISBN_13: restaurant.id},
            function (err, result) {
                if (err) {
                    deferred.reject(err);
                } else {
                    if (result != null) {
                        if (updateFlag == 1) {
                            var ISBN = restaurant.id;
                            // if restaurant is already present

                            var newcentScore = parseFloat((parseInt(restaurant.centScore) + parseInt(result.sentimentRating)) / 2);

                            uaRestuarantModel.update({ISBN_13: ISBN}, {sentimentRating: newcentScore},
                                function (err, updateResult) {
                                    if (err) {
                                        console.log(err);
                                        deferred.reject(err);
                                    }
                                    else {
                                        deferred.resolve(updateResult);
                                    }
                                });
                        }
                    } else {
                        console.log(restaurant.rating_img_url);

                        var avgRating = "//placehold.it/10x10";
                        if (restaurant.rating_img_url) {
                            console.log("avg rating present updating");
                            avgRating = restaurant.rating_img_url;
                            console.log("Vignesh" + avgRating);
                        }
                        var imageUrl = "//placehold.it/100x100";
                        if (restaurant.image_url) {
                            imageUrl = restaurant.image_url;
                        }

                        uaRestuarantModel.create({
                            ISBN_13: restaurant.id,
                            title: restaurant.name,
                            thumbnailUrl: imageUrl,
                            description: restaurant.snippet_text,
                            yelpPreviewLink: restaurant.url,
                            sentimentRating: avgRating
                        }, function (err, bookObj) {
                            if (err) {
                                deferred.reject("err adding restaurant");
                                deferred.reject(err);
                            } else {
                                deferred.resolve(1);
                            }
                        });
                    }
                }
            })
        return deferred.promise;
    }
}
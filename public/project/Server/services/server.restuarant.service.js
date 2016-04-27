"use strict";
module.exports = function(app, model, mongoose, passport) {

    var LocalStrategy = require('passport-local').Strategy;

    app.post("/api/restaurantfav/:userId", addFavRestaurantForUser);
    app.delete("/api/restaurantfav/:userId/:restaurantId", removeFavRestaurantForUser);
    app.get("/api/restaurantfavs/:userId", GetFavRestaurantsForCurrentUser);
    app.post("/api/restaurantReview/:userId", submitReview);
    app.get("/api/restaurantreviews/:restaurantID", getReviewsForRestaurantID);
    app.get("/api/userReviews/:userId", GetReviewsByUserId);
    app.get("/api/restaurantdetails/:restaurantId", GetRestaurantObjectById);


    function addFavRestaurantForUser(req, res) {
        model.addFavRestaurantForUser(req.params.userId, req.body)
            .then(function (userFavObj) {
                res.json(userFavObj);
            });
    }

    function removeFavRestaurantForUser(req, res) {
        model.RemoveFavRestaurantForUser(req.params.userId, req.params.restaurantId)
            .then(function (userFavs) {
                res.json(userFavs);
            })
    }

    function GetFavRestaurantsForCurrentUser(req, res) {
        model.GetFavRestaurantsForCurrentUser(req.params.userId)
            //console.log("server.restuarant.service userID VIGNESH POINT:"+req.params.userId);
            .then(function (userFavs) {
                res.json(userFavs);
            });
    }

    function submitReview(req, res) {
        model.SubmitReview(req.params.userId, req.body)
            .then(function (reviewRes) {
                res.json(reviewRes);
            });
    }

    function getReviewsForRestaurantID(req, res) {
        model.GetReviewsForRestaurantID(req.params.restaurantID)
            .then(function (bookReveiws) {
                res.json(bookReveiws);
            });
    }

    function GetReviewsByUserId(req, res) {
        model.GetReviewsByUserId(req.params.userId)
            .then(function (userReviews) {
                res.json(userReviews);
            });
    }

    function GetRestaurantObjectById(req, res) {
        model.GetRestaurantObjectById(req.params.restaurantId)
            .then(function (bookObj) {
                res.json(bookObj);
            });
    }
};
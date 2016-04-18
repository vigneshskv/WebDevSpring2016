"use strict";
module.exports = function(app, model, mongoose, passport) {

    var LocalStrategy = require('passport-local').Strategy;

    app.post("/api/bookfav/:userId", addFavBookForUser);
    app.delete("/api/bookfav/:userId/:bookId", removeFavBookForUser);
    app.get("/api/bookfavs/:userId", GetFavBooksForCurrentUser);
    app.post("/api/bookReview/:userId", submitReview);
    app.get("/api/bookreviews/:bookISBN", getReviewsForBookISBN);
    app.get("/api/userReviews/:userId", GetReviewsByUserId);
    app.get("/api/bookdetails/:bookId", GetBookObjectById);

    function addFavBookForUser(req, res) {
        model.AddFavBookForUser(req.params.userId, req.body)
            .then(function (userFavObj) {
                res.json(userFavObj);
            });
    }

    function removeFavBookForUser(req, res) {
        model.RemoveFavBookForUser(req.params.userId, req.params.bookId)
            .then(function (userFavs) {
                res.json(userFavs);
            })
    }

    function GetBookObjectById(req, res) {
        model.GetBookObjectById(req.params.bookId)
            .then(function (bookObj) {
                res.json(bookObj);
            });
    }

    function getReviewsForBookISBN(req, res) {
        model.GetReviewsForBookISBN(req.params.bookISBN)
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

    function submitReview(req, res) {
        model.SubmitReview(req.params.userId, req.body)
            .then(function (reviewRes) {
                res.json(reviewRes);
            });
    }


    function GetFavBooksForCurrentUser(req, res) {
        model.GetFavBooksForCurrentUser(req.params.userId)
            .then(function (userFavs) {
                res.json(userFavs);
            });
    }
};
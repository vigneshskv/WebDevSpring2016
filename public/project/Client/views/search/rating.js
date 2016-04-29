"use strict";
angular.module('UrbanAppetizerApp')
    .controller('RatingCtrl', function ($rootScope) {

        var model = this;
        model.rate = 4;
        model.max = 5;
        model.isReadonly = true;

    });
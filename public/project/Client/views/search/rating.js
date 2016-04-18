"use strict";
angular.module('UrbanAppetizerApp')
    .controller('RatingCtrl', function ($rootScope) {


        var model = this;
        model.rate = 4;
        model.max = 5;
        model.isReadonly = true;

        /*model.hoveringOver = function(value) {
         model.overStar = value;
         model.percent = 100 * (value / model.max);
         };

         model.ratingStates = [
         {stateOn: 'glyphicon-star', stateOff: 'glyphicon-star-empty'},
         ];*/
    });
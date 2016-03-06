/**
 * Created by vignesh on 3/5/2016.
 */

"use strict";

(function(){
    angular
        .module("HelloWorldApp", [])
        .controller("HelloWorldController", TheController);

    function TheController($scope){
        $scope.hello = "Hello World from Vignesh-AngularJS";
    }
})();
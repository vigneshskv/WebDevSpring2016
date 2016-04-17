"use strict";
(function(){
    angular
        .module("UrbanAppetizerApp")//,["ui.bootstrap"]);
        .controller("MainController",MainController);


    function MainController($scope){
        $scope.rate = 2;
        $scope.max = 7;
        $scope.isReadonly = true;
    }
})();
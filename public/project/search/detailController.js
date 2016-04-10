(function(){
    angular
        .module("UrbanAppetizerApp")
        .controller("DetailController", detailController);

    function detailController($scope, $routeParams, $http){
        $scope.restuarantID = $routeParams.restuarantID;
    }
})();
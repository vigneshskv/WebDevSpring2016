(function(){
    angular
        .module("UrbanAppetizerApp")
        .controller("DetailController", detailController);

    function detailController($scope, $routeParams, RestuarantService){
        $scope.restuarantID = $routeParams.restuarantID;

        RestuarantService.findRestuarantDetailByID(
            $scope.restuarantID,
            function(response) {
                console.log(response);
                $scope.restuarantsDetail = response;
            }
        )
    }
})();
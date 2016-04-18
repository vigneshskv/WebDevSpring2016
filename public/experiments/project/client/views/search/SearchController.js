(function(){
    angular
        .module("UrbanAppetizerApp")
        .controller("SearchController", searchController);

    function searchController($scope, $location, $routeParams, RestuarantService){
        // function call to search
        $scope.search = search;

        $scope.title = $routeParams.title;

        if($scope.title){
            search($scope.title);
        }

        function search(title){
            $location.url("/search/"+$scope.title);
            RestuarantService.findRestuarantByTitle(
                title,
                function(response) {
                    //console.log(response);
                    $scope.restuarants = response.businesses;
                });
        }
    }
})();
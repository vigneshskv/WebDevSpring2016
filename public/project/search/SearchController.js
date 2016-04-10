(function(){
    angular
        .module("UrbanAppetizerApp")
        .controller("SearchController", searchController);

    function searchController($scope, RestuarantService){
        $scope.search = search;
        $scope.title = "pizza";



        function search(title){
            RestuarantService.findRestuarantByTitle(
                title,
                function(response) {
                console.log(response);
                $scope.restuarants = response.businesses;
                //deferred.resolve(response);
            });
        }


    }
})();
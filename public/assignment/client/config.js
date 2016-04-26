(function(){
    angular
        .module("FormBuilderApp")
        .config(configuration);

    function configuration($routeProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "views/home/home.view.html",
                controller:"HomeController",
                resolve:{
                    checkLoggedIn: checkCurrentUser
                }
            })
            .when("/forms", {
                templateUrl: "views/forms/forms.view.html",
                controller: "FormController",
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .when("/fields", {
                templateUrl: "views/forms/field.view.html",
                controller: "FieldController",
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .when("/profile", {
                templateUrl: "views/users/profile.view.html",
                controller: "ProfileController",
                //controllerAs:"model",
                resolve:{
                    loggedin: checkLoggedin
                }
            })
            .when("/admin", {
                templateUrl: "views/admin/admin.view.html",
                controller: "AdminController",
                controllerAs: "model",
                resolve: {
                    loggedin: checkAdmin
                }
            })
            .when("/register", {
                templateUrl: "views/users/register.view.html",
                controller:"RegisterController"

            })
            .when("/login", {
                templateUrl: "views/users/login.view.html",
                controller: "LoginController"

            })
            .when("/form/:formId/fields",{
                templateUrl:"views/forms/field.view.html",
                controller: "FieldController",
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .otherwise({
                redirectTo: "/"
            });

    }


    var checkAdmin = function($q, $http, $rootScope)
    {
        var deferred = $q.defer();

        $http.get('/api/assignment/loggedin').success(function(user)
        {
            $rootScope.errorMessage = null;
            if (user !== '0' && user.roles.indexOf('admin') != -1)
            {
                console.log("admin found");
                $rootScope.currentUser = user;
                deferred.resolve();
            }
        });

        return deferred.promise;
    };

    function getLoggedIn(UserService, $q)
    {
        var deferred = $q.defer();
        UserService
            .getCurrentUser()
            .then(function(response){
                var currentUser = response.data;
                UserService.setUser(currentUser);
                deferred.resolve();
            });

        return deferred.promise;
    }

    var checkLoggedin = function($q, $timeout, $http, $location, $rootScope)
    {
        var deferred = $q.defer();
        $http.get("/api/assignment/loggedin").success(function(user)
        {
            $rootScope.errorMessage = null;
            if (user !== '0')
            {
                $rootScope.currentUser = user;
                deferred.resolve();
            }
            else
            {
                $rootScope.errorMessage = 'You need to log in.';
                deferred.reject();
                $location.url('/login');
            }
        });

        return deferred.promise;
    };


    var checkCurrentUser = function($q, $http, $location, $rootScope)
    {
        var deferred = $q.defer();

        $http.get('/api/assignment/loggedin').success(function(user)
        {
            $rootScope.errorMessage = null;
            if (user !== '0')
                $rootScope.currentUser = user;
            deferred.resolve();
        });

        return deferred.promise;
    };
})();
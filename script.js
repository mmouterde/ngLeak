var app = angular.module('ngLeakDemo', ['ngRoute']);

app.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'pages/home.html'
        })
        .when('/page2', {
            templateUrl: 'pages/page2.html',
            controller: 'page2Controller'
        });
});


app.controller("page2Controller", function ($scope, $http) {
    $scope.data = [];
    $http.get('data.json')
        .then(function (result) {
            $scope.data = result.data;
        });
});

app.directive('evil', function () {
    return {
        restrict: 'A',
        link: function (scope) {

            function eventHandler(e) {
                //YEAH ! I'AM THE MEMORY LEAK PART !!!

                //Here I have a reference to the current scope for ever ;o)
                scope.toString();
            }

            angular.element(window.document.body).on("keydown", eventHandler);

            //The memory leak solution  (commented for the demo)
            //angular.element(window.document.body).off("keydown",eventHandler)

        }
    };
});
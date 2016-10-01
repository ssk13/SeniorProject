// create the module and name it PseudoComposer
var PseudoComposer = angular.module('PseudoComposer', []);

var PseudoComposer = angular.module('PseudoComposer', ['ngRoute']);

// configure our routes
PseudoComposer.config(function($routeProvider) {
    $routeProvider

        // route for the home page
        .when('/', {
            templateUrl : 'pages/site-components/home.html',
            controller  : 'mainController'
        })

        // route for the home page
        .when('/home', {
            templateUrl : 'pages/site-components/home.html',
            controller  : 'mainController'
        })
});

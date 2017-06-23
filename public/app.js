var app = angular.module("VidLib", ['ui.router', 'ui.bootstrap','ngCookies']);

app.config(function($stateProvider, $urlRouterProvider, $httpProvider) {

    var ItemState = {
        name: 'items',
        url: '/',
        templateUrl: 'templates/items.html',
        controller: 'ItemsCtrl',
        controllerAs: 'item'
    };

    $stateProvider.state(ItemState);
    
    $urlRouterProvider.otherwise('/');

    $httpProvider.defaults.transformRequest = function(data){
        if (data === undefined) {
            return data;
        }
        return $.param(data);
    };

});
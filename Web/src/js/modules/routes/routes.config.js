/**=========================================================
 * Module: RoutesConfig.js
 =========================================================*/

(function () {
    'use strict';

    angular
        .module('naut')
        .config(routesConfig);

    routesConfig.$inject = ['$stateProvider', '$urlRouterProvider', 'RouteProvider'];
    function routesConfig($stateProvider, $urlRouterProvider, Route) {

        // Default route
        $urlRouterProvider.otherwise('/app/movie-list');

        // Application Routes States
        $stateProvider
            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: Route.base('app.html'),
                resolve: {
                    _assets: Route.require('icons', 'screenfull', 'sparklines', 'slimscroll', 'toaster', 'animate')
                }

            })
            .state('error404', {
                url: '/error404',
                templateUrl: Route.base('Error/Error404.html')
            })


            // doctor start
            .state('app.movie-new', {
                url: '/movie-new',
                templateUrl: Route.base('movie/movie.html'),
                resolve: {
                    assets: Route.require('ui.select', 'ngTable', 'ngTableExport'),
                }

            })
            .state('app.movie-edit', {
                url: '/movie-edit',
                templateUrl: Route.base('movie/movie.html'),
                resolve: {
                    assets: Route.require('ui.select', 'ngTable', 'ngTableExport'),
                }
            })
            .state('app.movie-detail', {
                url: '/movie-detail',
                templateUrl: Route.base('movie/movie-detail.html'),
                resolve: {
                    assets: Route.require('ui.select', 'ngTable', 'ngTableExport'),
                }
            })
            .state('app.movie-list', {
                url: '/movie-list',
                templateUrl: Route.base('movie/list.movie.html'),
                resolve: {
                    assets: Route.require('ui.select', 'ngTable', 'ngTableExport'),
                }


            })

    }


})();


/**=========================================================
 * Module: HeaderNavController
 * Controls the header navigation
 =========================================================*/


'use strict';

angular
    .module('naut')
    .controller('HeaderNavController', ['$scope', '$rootScope', '$location', '$modal', '$window', 'authService', 'localStorageService', 'ngAuthSettings', '$remember', '$timeout', 'modalService', '$forget', 'initService',


function ($scope, $rootScope, $location, $modal, $window, authService, localStorageService, ngAuthSettings, $remember, $timeout, modalService, $forget, initService) {




    $scope.userTitle = "";
    $scope.headerMenuCollapsed = true;

    $scope.toggleHeaderMenu = function () {
        $scope.headerMenuCollapsed = !$scope.headerMenuCollapsed;
    };

    // Adjustment on route changes
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        $scope.headerMenuCollapsed = true;
    });

    $scope.logout = function () {

        authService.logOut($scope.loginData);
    };

    var authData = localStorageService.get('authorizationData');
    if (authData) {
        $scope.userTitle = authData.firstName + " " + authData.lastName
        $scope.customer = authData.customerName
    }




}
    ]);

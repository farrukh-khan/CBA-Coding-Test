'use strict';
angular.module('naut').factory('initService', ['$http', '$q', 'localStorageService', 'ngAuthSettings',
    function ($http, $q, localStorageService, ngAuthSettings) {

        var serviceBase = ngAuthSettings.apiServiceBaseUri;
        var initServiceFactory = {};

        var _getNavigation = function (roleId) {

            return $http.get(serviceBase + 'api/Init/GetNavigation?roleId=' + roleId).then(function (response) {
                return response;
            });

        };


        // get init data
        var _getInitData = function () {

            return $http.get(serviceBase + 'api/Init/GetInitData').then(function (response) {
                return response;
            });

        };


        initServiceFactory.getInitData = _getInitData;
        initServiceFactory.getNavigation = _getNavigation;

        return initServiceFactory;
    }]);
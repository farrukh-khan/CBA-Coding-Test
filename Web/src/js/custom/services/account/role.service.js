'use strict';
angular.module('naut').factory('roleService', ['$http', '$q', 'localStorageService', 'ngAuthSettings',
    function ($http, $q, localStorageService, ngAuthSettings) {

        var serviceBase = ngAuthSettings.apiServiceBaseUri;
        var roleServiceFactory = {};

        var _getRoles = function (clientId) {

            return $http.get(serviceBase + 'api/Account/GetRoles?companyId=' + clientId).then(function (response) {
                return response;
            });
        };


        var _getCustomers = function () {

            return $http.get(serviceBase + 'api/Customer/GetCustomers/').then(function (response) {
                return response;
            });

        };

        var _getRoleById = function (id, clientId) {

            return $http.get(serviceBase + 'api/Account/GetRoleById/?id=' + id + '&CompanyId=' + clientId).then(function (response) {
                return response;
            });

        };



        var _roleSubmit = function (model) {

            return $http.post(serviceBase + 'api/Account/RoleSubmit/', model).then(function (response) {
                return response;
            });

        };


        var _delete = function (id, clientId) {

            return $http.get(serviceBase + 'api/Account/DeleteRole/?id=' + id + '&CompanyId=' + clientId).then(function (response) {
                return response;
            });

        };


        roleServiceFactory.getCustomers = _getCustomers;
        roleServiceFactory.getRoleById = _getRoleById;
        roleServiceFactory.getRoles = _getRoles;
        roleServiceFactory.roleSubmit = _roleSubmit;
        roleServiceFactory.delete = _delete;

        return roleServiceFactory;
    }]);
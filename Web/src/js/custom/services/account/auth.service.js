'use strict';
angular.module('naut').factory('authService', ['$http', '$q', 'localStorageService', 'ngAuthSettings', '$templateCache', "$forget", "$location","sharedService",
    function ($http, $q, localStorageService, ngAuthSettings, $templateCache, $forget, $location, sharedService) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;
    var authServiceFactory = {};

    var _authentication = {
        isAuth: false,
        userName: "",
        useRefreshTokens: true,
        isLogout: false,
        roleId: -1,
        roleName:""
    };


    var _login = function (loginData) {

        if (loginData != null) {

            var scop = [];
            scop.push(loginData.isLogOffUser);

            var authData = localStorageService.get('authorizationData');

            if (authData) {
                scop.push(authData.refreshToken);
            }
            else
                scop.push("404");


            scop.push("APPLOGIN");

            var data = "grant_type=password&username=" + loginData.userName + "&password=" + loginData.password + "&client_id=" + ngAuthSettings.clientId + "&Scope=" + scop;

            var deferred = $q.defer();

            $http.post(serviceBase + 'token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {


                localStorageService.set('authorizationData', {
                    token: response.access_token, userName: loginData.userName,
                    firstName: response.FirstName, lastName: response.LastName, refreshToken: response.refresh_token,
                    useRefreshTokens: true, fkUser: response.UserId, userType: response.UserType, roleId: response.RoleId,
                    clientId: response.CompanyId, customerName: response.CustomerName, subCompanyId: response.SubCompanyId,
                    roleName: response.RoleName
                });
                _authentication.isAuth = true;
                _authentication.userName = loginData.userName;
                _authentication.useRefreshTokens = loginData.useRefreshTokens;


                localStorageService.set('permissionData', {
                    isAdd: false,
                    isEdit: false,
                    isDelete: false,
                });


               var productWithRateModel = {

                    companyId: response.CompanyId,
                    subCompanyId: response.SubCompanyId
                };

                sharedService.getShareds(productWithRateModel, 'Order/GetProductsWithRate').then(function (response) {
                    //$scope.testList = response.data;

                    localStorageService.set('testListData', {
                        testList:response.data,
                    });
                });


                deferred.resolve(response);

            }).error(function (err, status) {

                _logOut();
                deferred.reject(err);

            });
            return deferred.promise;
        }

    };


    var _superAdminlogin = function (loginData) {
        var deferred = $q.defer();
        if (loginData != null) {
            var authData = localStorageService.get('authorizationData');
            _authentication.isLogout = true;
            $http.get(serviceBase + 'api/Account/Logout/?email=' + _authentication.userName + "&token=" + authData.refreshToken).success(function (response) {
                localStorageService.remove('authorizationData');
                _authentication.isAuth = false;
                _authentication.userName = "";
                _authentication.useRefreshTokens = true;


                var scop = [];
                scop.push(loginData.isLogOffUser);

                authData = localStorageService.get('authorizationData');
                if (authData)
                    scop.push(authData.refreshToken);
                else
                    scop.push("404");

                scop.push("ADMINLOGIN");

                var data = "grant_type=password&username=" + loginData.userName + "&password=" + loginData.password + "&client_id=" + ngAuthSettings.clientId + "&Scope=" + scop;



                $http.post(serviceBase + 'token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {

                    localStorageService.set('authorizationData', {
                        token: response.access_token, userName: loginData.userName,
                        firstName: response.FirstName, lastName: response.LastName,
                        refreshToken: response.refresh_token, useRefreshTokens: true,
                        fkUser: response.UserId, iCustomer: response.ICustomer,
                        userType: response.UserType, roleId: response.RoleId,
                        clientId: response.ClientId, customerName: response.CustomerName,
                        roleName: response.RoleName
                    });
                    _authentication.isAuth = true;
                    _authentication.userName = loginData.userName;
                    _authentication.useRefreshTokens = loginData.useRefreshTokens;


                    localStorageService.set('permissionData', {
                        isAdd: false,
                        isEdit: false,
                        isDelete: false,
                    });


                    deferred.resolve(response);

                }).error(function (err, status) {

                    _logOut();
                    deferred.reject(err);

                });



            });


        }
        return deferred.promise;
    };






    var _logOut = function () {




        $location.search('id', null)

        if (_authentication.userName != "") {
            var authData = localStorageService.get('authorizationData');
            if (authData) {
                _authentication.isLogout = true;
                $http.get(serviceBase + 'api/Account/Logout/?email=' + _authentication.userName + "&token=" + authData.refreshToken).success(function (response) {
                    localStorageService.remove('authorizationData');
                    _authentication.isAuth = false;
                    _authentication.userName = "";
                    _authentication.useRefreshTokens = true;


                    $location.path('/login');



                });
            }
            var testData = localStorageService.get('testListData');
            if (testData) {
                localStorageService.remove('testListData');
            }
        };

    }

    var _fillAuthData = function () {

        var authData = localStorageService.get('authorizationData');

        if (authData) {
            _authentication.isAuth = true;
            _authentication.userName = authData.userName;
            _authentication.isLogout = false;
            _authentication.useRefreshTokens = authData.useRefreshTokens;
            _authentication.roleId = authData.roleId;
            _authentication.roleName = authData.roleName;
        }
    };

    var _refreshToken = function () {
        var deferred = $q.defer();

        var authData = localStorageService.get('authorizationData');

        if (authData) {

            if (authData.useRefreshTokens) {

                var data = "grant_type=refresh_token&refresh_token=" + authData.refreshToken + "&client_id=" + ngAuthSettings.clientId;

                localStorageService.remove('authorizationData');

                $http.post(serviceBase + 'token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {

                    localStorageService.set('authorizationData', { token: response.access_token, userName: response.userName, refreshToken: response.refresh_token, useRefreshTokens: true });

                    deferred.resolve(response);

                }).error(function (err, status) {
                    _logOut();
                    deferred.reject(err);
                });
            }
        }

        return deferred.promise;
    };


    var _userAuthenticate = function () {


        var deferred = $q.defer();

        var authData = localStorageService.get('authorizationData');

        if (authData) {

            if (_authentication.isAuth) {

                $http.get(serviceBase + 'api/Account/UserAthentication/?tokenId=' + authData.refreshToken).success(function (response) {

                    if (response == 'false') {
                        _logOut();
                    }

                }).error(function (err, status) {
                    _logOut();
                    deferred.reject(err);
                });
            }
        }

        return deferred.promise;
    };


    var _getUsers = function (model) {


        return $http.post(serviceBase + 'api/Account/GetUsers' + model).then(function (response) {
            return response;
        });

    };


    var _getUsersById = function (id) {

        return $http.get(serviceBase + 'api/Account/GetUserById/?id=' + id).then(function (response) {
            return response;
        });

    };


    var _userSubmit = function (model) {

        return $http.post(serviceBase + 'api/Account/UserSubmit', model, {
            
        }).then(function (response) {
            return response;
        });

    };


    var _deleteUser = function (id, clientId) {

        return $http.get(serviceBase + 'api/Account/DeleteUser/?id=' + id + '&CompanyId=' + clientId).then(function (response) {
            return response;
        });

    };

    var _emailVarification = function (email) {

        return $http.get(serviceBase + 'api/Account/EmailVarification/?email=' + email).then(function (response) {
            return response;
        });

    };


    var _verifyCode = function (model) {

        return $http.post(serviceBase + 'api/Account/VerifyCode', model).then(function (response) {
            return response;
        });

    };

    var _resetPassword = function (model) {

        return $http.post(serviceBase + 'api/Account/ResetPassword', model).then(function (response) {
            return response;
        });

    };

    var _uploadImage = function (file) {

        return $http.post(serviceBase + 'api/Account/UploadImage', file, {
            headers: { 'Content-Type': undefined },
            transformRequest: angular.identity
        }).then(function (response) {
            return response;
        });
        
    };
    
    var _uploadVoucherImage = function (file) {

        return $http.post(serviceBase + 'api/Voucher/UploadVoucherImage', file, {
            headers: { 'Content-Type': undefined },
            transformRequest: angular.identity
        }).then(function (response) {
            return response;
        });
    };



    authServiceFactory.superAdminlogin = _superAdminlogin;
    authServiceFactory.emailVarification = _emailVarification;
    authServiceFactory.verifyCode = _verifyCode;
    authServiceFactory.resetPassword = _resetPassword;

    authServiceFactory.deleteUser = _deleteUser;
    authServiceFactory.login = _login;
    authServiceFactory.logOut = _logOut;
    authServiceFactory.getUsersById = _getUsersById;
    authServiceFactory.getUsers = _getUsers;
    authServiceFactory.userSubmit = _userSubmit;
    authServiceFactory.fillAuthData = _fillAuthData;
    authServiceFactory.authentication = _authentication;
    authServiceFactory.refreshToken = _refreshToken;
    authServiceFactory.userAuthenticate = _userAuthenticate;
    authServiceFactory.UploadImage = _uploadImage;
    authServiceFactory.UploadVoucherImage = _uploadVoucherImage;
    return authServiceFactory;
}]);
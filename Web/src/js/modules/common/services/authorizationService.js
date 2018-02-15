app.factory('authorizationService', function ($resource, $q, $rootScope, $location, ngAuthSettings, localStorageService, $http, $location) {
    return {
        // We would cache the permission for the session,
        //to avoid roundtrip to server
        //for subsequent requests

        permissionModel: {
            isPermissionAllowed: false,
            isPermissionLoaded: false
        },

        permissionCheck: function (url) {


            // we will return a promise .
            var deferred = $q.defer();

            //this is just to keep a pointer to parent scope from within promise scope.
            var parentPointer = this;

            //Checking if permission object(list of roles for logged in user) is already filled from service
            //if (this.permissionModel.isPermissionLoaded) {
            //    //Check if the current user has required role to access the route
            //    this.getPermission(this.permissionModel.isPermissionAllowed, deferred);
            //} else {
            //if permission is not obtained yet, we will get it from  server.
            // 'api/permissionService' is the path of server web service , used for this example.
            var serviceBase = ngAuthSettings.apiServiceBaseUri;


            var iCustomer = "";
            var userType = 3;
            var roleId = roleId;
            var authData = localStorageService.get('authorizationData');
            if (authData) {
                roleId = authData.roleId;
                userType = authData.userType;
            }


            if (url == "report") {

                var id = $location.search().id;

                if (id) {
                    url = url + "," + id;
                }

            }

            $http.get(serviceBase + '/api/Permission/GetAssginedPermission/?url=' + url + '&roleId=' + roleId + '&userType=' + userType)
                //.get(
                //function (data)
                //{

                //    console.log(data);
                //}

                //).$promise.then

            .success(function (response) {
                //when server service responds then we will fill the permission object

                localStorageService.set('permissionData', {
                    isAdd: response.add,
                    isEdit: response.edit,
                    isDelete: response.delete,
                    isDetail: response.detail,
                });


                parentPointer.permissionModel.isPermissionAllowed = response.isAllowed;

                //Indicator is set to true that permission object is filled and 
                //can be re-used for subsequent route request for the session of the user
                parentPointer.permissionModel.isPermissionLoaded = true;

                //Check if the current user has required role to access the route
                parentPointer.getPermission(parentPointer.permissionModel.isPermissionAllowed, deferred);
            });
            //}
            return deferred.promise;
        },

        //Method to check if the current user has required role to access the route
        //'permissionModel' has permission information obtained from server for current user
        //'deferred' is the object through which we shall resolve promise
        getPermission: function (isPermissionAllowed, deferred) {

            var ifPermissionPassed = false;
            ifPermissionPassed = isPermissionAllowed;



            if (!ifPermissionPassed) {


                //If user does not have required access, we will route the user to unauthorized access page
                //$location.path(routeForUnauthorizedAccess);



                var authData = localStorageService.get('authorizationData');
                var usertype = 3;

                if (authData != null && $location.$$path != '/app/reportcatalogue ') {
                    $location.search('id', null)
                    if (authData) {
                        usertype = authData.userType;
                    }


                    if (usertype == 1) {
                        $location.path('/app/companies');

                    } else {
                        $location.path('/app/dashboard');
                    }

                }
                if (authData != null && $location.$$path != '/app/dashboard ') {
                    $location.path('/app/home');
                }
                else {

                    $location.path('/login');
                }
                //As there could be some delay when location change event happens, 
                //we will keep a watch on $locationChangeSuccess event
                // and would resolve promise when this event occurs.

                $rootScope.$on('$locationChangeSuccess', function (next, current) {
                    deferred.resolve();
                });
            } else {
                deferred.resolve();
            }
        }
    };
});
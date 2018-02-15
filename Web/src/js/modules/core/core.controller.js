/**=========================================================
 * Module: CoreController.js
 =========================================================*/

(function () {
    'use strict';

    angular
        .module('naut')
        .controller('CoreController',  CoreController );

    /* @ngInject */
    function CoreController($rootScope, localStorageService) {
        // Get title for each page
        $rootScope.pageTitle = function () {

            return "Movies Album";
            //return $rootScope.app.name + ' - ' + $rootScope.app.description;
        };

        // Cancel events from templates
        // ----------------------------------- 
        $rootScope.cancel = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
        };

        //$rootScope.fsYear = '2016_2017_BE';
        //$rootScope.grantId = '1';
    }

})();

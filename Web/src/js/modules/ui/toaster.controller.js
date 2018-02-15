/**=========================================================
 * Module: DemoToasterController.js
 * Demos for toaster notifications
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('naut')
        .controller('ToasterController', ToasterController);
    /* @ngInject */
    function ToasterController($scope, toaster) {

      $scope.toaster = {
          type:  'success',
          title: 'Title',
          text:  'Message'
      };

      $scope.pop = function() {
        toaster.pop($scope.toaster.type, $scope.toaster.title, $scope.toaster.text);
      };

    }
})();

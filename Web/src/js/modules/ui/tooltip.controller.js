/**=========================================================
 * Module: DemoTooltipController.js
 * Provides a simple demo for tooltip
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('naut')
        .controller('TooltipController', TooltipController);
    /* @ngInject */
    function TooltipController($scope) {

      $scope.dynamicTooltip = 'Hello, World!';
      $scope.dynamicTooltipText = 'dynamic';
      $scope.htmlTooltip = 'I\'ve been made <b>bold</b>!';

    }

})();

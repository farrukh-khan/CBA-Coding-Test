/**=========================================================
 * Module: demo-alerts.js
 * Provides a simple demo for pagination
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('naut')
        .controller('AccordionControllerSKIP', AccordionController);
    /* @ngInject */
    function AccordionController($scope) {


        $scope.groups = [
          {
              title: "Dynamic Group Header - 1",
              content: "Dynamic Group Body - 1",
              open: true
          },
          {
              title: "Dynamic Group Header - 2",
              content: "Dynamic Group Body - 2",
              open: false
          },
          {
              title: "Dynamic Group Header - 3",
              content: "Dynamic Group Body - 3",
              open: false
          }
        ];

        $scope.toggleOpen = function () {
            console.log('t');
        }


        $scope.addGroup = function () {
            $scope.groups.push({
                title: "New One Created",
                content: "Dynamically added new one",
                open: false
            });
        }
    }

})();

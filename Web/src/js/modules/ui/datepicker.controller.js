/**=========================================================
 * Module: DemoDatepickerDemoController.js
 * Provides a simple demo for bootstrap datepicker
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('naut')
        .controller('DatepickerDemoController', DatepickerDemoController);
    /* @ngInject */
    function DatepickerDemoController($scope) {

      $scope.today = function() {
        $scope.dt = new Date();
      };
      $scope.today();

      $scope.clear = function () {
        $scope.dt = null;
      };

      // Disable weekend selection
      $scope.disabled = function(date, mode) {
        return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
      };

      $scope.toggleMin = function() {
        $scope.minDate = $scope.minDate ? null : new Date();
      };
      $scope.toggleMin();

      $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
      };

      $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
      };

      $scope.monthOptions = {
          datepickerMode: "'month'",
          minMode: 'month'
      };

      $scope.monthFormat = 'MMMM yyyy';

      $scope.initDate = new Date('2016-15-20');
      $scope.formats = ['dd-MM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
      $scope.format = $scope.formats[0];

    }
})();

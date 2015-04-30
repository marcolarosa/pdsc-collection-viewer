'use strict';

/**
 * @ngdoc function
 * @name pdscApp.controller:ItemCtrl
 * @description
 * # ItemCtrl
 * Controller of the pdscApp
 */
angular.module('pdscApp')
  .controller('ItemCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });

'use strict';

/**
 * @ngdoc function
 * @name pdscApp.controller:CollectionCtrl
 * @description
 * # CollectionCtrl
 * Controller of the pdscApp
 */
angular.module('pdscApp')
  .controller('CollectionCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });

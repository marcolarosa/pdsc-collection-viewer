'use strict';

angular.module('pdsc')
  .filter('trustAsHtml', [ 
    '$sce', 
    function ($sce) {
    return function (input) {
        return $sce.trustAsResourceUrl(input);
    };
  }]);

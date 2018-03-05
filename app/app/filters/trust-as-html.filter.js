'use strict';

module.exports = [
  '$sce',
  $sce => {
    return input => {
      return $sce.trustAsResourceUrl(input);
    };
  }
];

// angular.module('pdsc').filter('trustAsHtml', [
//   '$sce',
//   function($sce) {
//     return function(input) {
//       return $sce.trustAsResourceUrl(input);
//     };
//   }
// ]);

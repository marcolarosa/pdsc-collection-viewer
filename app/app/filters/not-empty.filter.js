'use strict';

module.exports = [
  'lodash',
  lodash => {
    return input => {
      return !lodash.isEmpty(input) ? true : false;
    };
  }
];

// angular.module('pdsc').filter('notEmpty', [
//   '_',
//   function(_) {
//     return function(input) {
//       return !_.isEmpty(input) ? true : false;
//     };
//   }
// ]);

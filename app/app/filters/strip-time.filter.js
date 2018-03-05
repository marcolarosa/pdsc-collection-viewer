'use strict';

module.exports = [
  () => {
    return input => {
      return input.split('#')[0];
    };
  }
];

// angular.module('pdsc')
//   .filter('stripTime', function () {
//     return function (input) {
//       return input.split('#')[0];
//     };
//   });

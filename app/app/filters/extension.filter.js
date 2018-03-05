'use strict';

module.exports = [
  () => {
    return input => {
      var c = input.split('/').pop();
      return c.split('.')[1];
    };
  }
];

// angular.module('pdsc')
//   .filter('extension', function () {
//     return function (input) {
//         var c = input.split('/').pop();
//         return c.split('.')[1];
//     };
//   });

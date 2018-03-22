'use strict';

const {throttle} = require('lodash');

module.exports = [
  'dataService',
  dataService => {
    return {
      template: '',
      restrict: 'A',
      link: function(scope, element) {
        element.on('timeupdate', function(time) {
          scope.$apply(function() {
            dataService.broadcastMediaElementTime(
              time.currentTarget.currentTime
            );
          });
        });
      }
    };
  }
];

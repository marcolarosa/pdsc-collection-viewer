'use strict';

angular.module('pdsc')
  .directive('scrollToFragment', [ 
    '$location', 
    '$anchorScroll',
    function ($location, $anchorScroll) {
    return {
      restrict: 'A',
      link: function postLink(scope, element) {
          scope.$watch('currentTime', function() {
              if (scope.currentTime) {
                  var d;
                  if (scope.transcript) {
                      d = scope.transcript;
                  } else if (scope.interlinearText) {
                      d = scope.interlinearText;
                  }
                  var transformed = _.map(d, function(t) {
                      if (t.id > scope.currentTime) {
                          return 1;
                      } else {
                          return 0;
                      }
                  });
                  scope.selectedIndex = _.indexOf(transformed, 1, true) - 1;
                  var o = $location.hash();
                  $location.hash(scope.name + '_' + scope.selectedIndex);
                  $anchorScroll();
                  $location.hash(o);
              }
          });
      }
    };
  }]);

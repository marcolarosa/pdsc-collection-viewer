'use strict';

angular.module('pdsc')
  .directive('renderThumbnailFilmstrip', [ 
    '$timeout', 
    '$location', 
    '$anchorScroll',
    '$mdSidenav',
    function ($timeout, $location, $anchorScroll, $mdSidenav) {
    return {
      templateUrl: 'app/components/main/view-image-set/render-thumbnail-filmstrip/render-thumbnail-filmstrip.html',
      restrict: 'E',
      scope: {
          itemData: '=',
          selected: '='
      },
      link: function postLink(scope) {
          scope.smallImages = _.map(scope.itemData.thumbnails, function(d, i) {
              var selected = '';
              return {
                  'id': i,
                  'source': d,
              };
          });


          scope.$watch('isOpen()', function(n, o) {
              if (n) {
                  scope.smallImages = _.map(scope.smallImages, function(d, i) {
                      var selected = '';
                      if (i === scope.selected) {
                          d.selected = 'filmstrip-highlight-current';
                      }
                      return d;
                  });

                  // scroll the thumbnails
                  $timeout(function() {
                      var old = $location.hash();
                      $location.hash(scope.selected);
                      $anchorScroll();
                      $location.hash(old);
                  }, 500);
              }
          });
          scope.isOpen = function() {
            return $mdSidenav('thumbnailFilmstrip').isOpen();
          }


      }
    };
  }]);

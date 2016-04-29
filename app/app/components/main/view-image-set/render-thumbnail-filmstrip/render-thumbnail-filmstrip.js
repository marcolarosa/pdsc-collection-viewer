'use strict';

angular.module('pdsc')
  .directive('renderThumbnailFilmstrip', [ 
    '$timeout', 
    '$location', 
    '$anchorScroll',
    '$mdSidenav',
    '_',
    function ($timeout, $location, $anchorScroll, $mdSidenav, _) {
    return {
      templateUrl: 'app/components/main/view-image-set/render-thumbnail-filmstrip/render-thumbnail-filmstrip.html',
      restrict: 'E',
      scope: {
          itemData: '=',
          selectedItem: '='
      },
      link: function postLink(scope) {
          scope.smallImages = _.map(scope.itemData.thumbnails, function(d, i) {
              return {
                  'id': i,
                  'source': d,
              };
          });

          scope.$watch('isOpen()', function(n) {
              if (n) {
                  scope.smallImages = _.map(scope.smallImages, function(d, i) {
                      if (i === scope.selectedItem) {
                          d.selected = 'filmstrip-highlight-current';
                      } else {
                          delete d.selected;
                      }
                      return d;
                  });

                  // scroll the thumbnails
                  $timeout(function() {
                      var old = $location.hash();
                      $location.hash(scope.selectedItem);
                      $anchorScroll();
                      $location.hash(old);
                  }, 500);
              }
          });
          scope.isOpen = function() {
            return $mdSidenav('thumbnailFilmstrip').isOpen();
          };

          scope.jumpTo = function(i) {
              scope.selectedItem = i;
          };

      }
    };
  }]);

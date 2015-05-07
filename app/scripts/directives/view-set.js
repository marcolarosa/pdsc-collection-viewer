'use strict';

angular.module('pdscApp')
  .directive('viewSet', [ '$log', '$window', '$location', '$anchorScroll', '$timeout',  
        function ($log, $window, $location, $anchorScroll, $timeout) {
    return {
      templateUrl: 'views/view-set.html',
      restrict: 'E',
      scope: {
          imageSetData: '=',
          instanceId: '=',
      },
      link: function postLink(scope, element, attrs) {
          // defaults
          scope.showImageSet = false;
          scope.showFilmstrip = false;
          scope.showItemInformation = false;

          // handle window resize events
          var w = angular.element($window);
          w.bind('resize', function() {
              scope.$apply(function() {
                sizeThePanels();
              })
          });

          var sizeThePanels = function() {
              scope.height = $window.innerHeight;
              scope.width = $window.innerWidth;
              scope.navbarHeight = 100;
              scope.panelHeight = $window.innerHeight;
              scope.imagePaneHeight = scope.panelHeight - scope.navbarHeight - 50;

              if (scope.showFilmstrip === true) {
                  scope.filmstripHeight = 250;
                  scope.imagePaneHeight = scope.panelHeight - scope.navbarHeight - scope.filmstripHeight;
                  scope.imageHeight = scope.filmstripHeight - 20;
              }
          }

          scope.$watch('imageSetData', function() {
              if (!_.isEmpty(scope.imageSetData)) {
                  //$log.debug('D:view-set; image-set data', scope.imageSetData);

                  // figure out sizes
                  scope.showFilmstrip = false;
                  sizeThePanels();
                  
                  // load up the image
                  if (scope.instanceId) {
                      scope.current = parseInt(scope.instanceId) - 1;
                  } else {
                      scope.current = 0;
                  }
                  scope.loadImage();

                  // set the viewer to visible
                  scope.showImageSet = true;
              }
          });

          scope.loadImage = function() {
              scope.image = scope.imageSetData.images[scope.current];
              scope.figureOutPaginationControls();
              scope.highlightThumbnail();
          }

          scope.figureOutPaginationControls = function() {
              // toggle the pagination controls
              if (scope.current === 0) {
                  // show next not previous
                  scope.showNext = true;
                  scope.showPrevious = false;
              } else if (scope.current === scope.imageSetData.images.length -1) {
                  // show previous not next
                  scope.showNext = false;
                  scope.showPrevious = true;
              } else {
                  // show both
                  scope.showNext = true;
                  scope.showPrevious = true;
              }
          }

          // page to next image
          scope.next = function() {
              scope.current += 1;
              if (scope.current === scope.imageSetData.images.length -1) scope.current = scope.imageSetData.images.length -1;
              scope.loadImage();
          }

          // page to previous image
          scope.previous = function() {
              scope.current -= 1;
              if (scope.current === 0) scope.current = 0;
              scope.loadImage();
          }

          // jump to first image
          scope.jumpToStart = function(){
              scope.current = 0;
              scope.loadImage();
          }

          // jump to last image
          scope.jumpToEnd = function(){
              scope.current = scope.imageSetData.images.length -1;
              scope.loadImage();
          }
          
          // highlight thumbnail
          scope.highlightThumbnail = function() {
              _.each(scope.smallImages, function(d, i) {
                  d.selected = '';
                  if (i === scope.current) d.selected = 'filmstrip-highlight-current';
              })
              scope.scrollThumbnails();
          }

          // toggle the filmstrip view
          scope.toggleFilmstrip = function() {
              scope.showFilmstrip = !scope.showFilmstrip;
              scope.smallImages = _.map(scope.imageSetData.images, function(d, i) { 
                  var selected = '';
                  if (i === scope.current) selected = 'filmstrip-highlight-current'; 
                  return {
                      'id': i,
                      'source': scope.imageSetData.images[i],
                      'selected': selected
                  }
              });
              sizeThePanels();
              $timeout(function() {
                  scope.scrollThumbnails();
              }, 100);
          }

          scope.toggleItemInformation = function() {
              console.log('here');
              scope.showItemInformation = !scope.showItemInformation;
          }

          scope.jumpToPage = function(i) {
              scope.current = i;
              scope.loadImage();
          }

          scope.scrollThumbnails = function() {
              // scroll the thumbnails
              var old = $location.hash();
              $location.hash(scope.current);
              $anchorScroll();
              $location.hash(old);
          }

      }
    };
  }]);

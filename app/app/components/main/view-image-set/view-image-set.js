'use strict';

angular.module('pdsc')
  .directive('viewImageSet', [ 
    '$log', 
    '$window', 
    '$location', 
    '$anchorScroll', 
    '$timeout',  
    '_',
    function ($log, $window, $location, $anchorScroll, $timeout, _) {
    return {
      templateUrl: 'app/components/main/view-image-set/view-image-set.html',
      restrict: 'E',
      scope: {
          itemData: '=',
          instanceId: '='
      },
      link: function postLink(scope) {
          // defaults
          scope.showImage = false;
          scope.showImageSet = false;
          scope.showFilmstrip = false;
          scope.showItemInformation = false;
          scope.disableThumbnailView = false;
          scope.currentRotation = 0;
          scope.currentScale = 1;
          scope.scaleStep = 0.5;
          scope.isOpen = false; 

          // handle window resize events
          var w = angular.element($window);
          w.bind('resize', function() {
              scope.$apply(function() {
                sizeThePanels();
              });
          });

          scope.$on('image-loaded', function() {
              scope.setTransform();
              scope.showImage = true;
          });

          var sizeThePanels = function() {
              scope.width = $window.innerWidth;
              scope.navbarHeight = 35;
              var panelHeight = $window.innerHeight - scope.headerHeight - scope.navbarHeight - 40;
              scope.filmstripHeight = 250;
              scope.filmstripImageHeight = scope.filmstripHeight - 20;

              scope.contentPaneLeft = {
                  'position': 'absolute',
                  'top': scope.navbarHeight + 'px', 
                  'left': '0',
                  'width': '5%',
                  'height': panelHeight + 'px'
              };
              scope.contentPaneCenter = {
                  'position': 'absolute',
                  'top': scope.navbarHeight + 'px', 
                  'left': '5%',
                  'width': '90%',
                  'height': panelHeight + 'px',
                  'overflow': 'auto'
              };
              scope.contentPaneRight = {
                  'position': 'absolute',
                  'top': scope.navbarHeight + 'px', 
                  'left': '95%',
                  'width': '5%',
                  'height': panelHeight + 'px'
              };
              scope.filmstripBackStyle = {
                  'position': 'absolute',
                  'top': scope.navbarHeight + panelHeight - scope.filmstripHeight + 'px',
                  'left': '0',
                  'width': '100%',
                  'height': scope.filmstripHeight + 'px',
                  'opacity': '0.5',
                  'z-index': '40'
              };
              scope.filmstripBackStyle = {
                  'position': 'absolute',
                  'top': scope.navbarHeight + panelHeight - scope.filmstripHeight + 'px',
                  'left': '0',
                  'width': '100%',
                  'height': scope.filmstripHeight + 'px',
                  'overflow-x': 'scroll',
                  'white-space': 'nowrap',
                  'display': 'inline-block',
                  'z-index': '50',
                  'padding': '5px 5px',
                  'border-top': '2px solid #ccc'
              };
          };

          scope.$watch('itemData', function() {
              if (!_.isEmpty(scope.itemData)) {
                  //$log.debug('D:view-set; image-set data', scope.itemData);

                  // figure out sizes
                  scope.showFilmstrip = false;
                  sizeThePanels();
                  
                  // load up the image
                  if (scope.instanceId) {
                      if (isNaN(parseInt(scope.instanceId))) {
                          // assume the name has been passed in - process it to extract the image number
                          scope.current = parseInt(scope.instanceId.split('.')[0].split('-')[2]) - 1;
                      } else {
                          scope.current = parseInt(scope.instanceId) - 1;
                      }
                  } else {
                      scope.current = 0;
                  }
                  scope.loadImage();

                  // set the viewer to visible
                  scope.showImageSet = true;
              }
          });

          scope.loadImage = function() {
              scope.showImage = false;
              scope.image = scope.itemData.images[scope.current];
              scope.figureOutPaginationControls();
              scope.highlightThumbnail();
          };

          scope.figureOutPaginationControls = function() {
              // only 1 image? disable both controls
              if (scope.itemData.images.length === 1) {
                  scope.showNext = false;
                  scope.showPrevious = false;
                  
                  // and disable thumbnail view as it's useless
                  scope.disableThumbnailView = true;
                  return;
              }

              // otherwise - toggle the controls as required
              if (scope.current === 0) {
                  // show next not previous
                  scope.showNext = true;
                  scope.showPrevious = false;
              } else if (scope.current === scope.itemData.images.length -1) {
                  // show previous not next
                  scope.showNext = false;
                  scope.showPrevious = true;
              } else {
                  // show both
                  scope.showNext = true;
                  scope.showPrevious = true;
              }
          };

          // page to next image
          scope.next = function() {
              if (scope.current === scope.itemData.images.length -1) {
                  return;
              }
              scope.current += 1;
              scope.loadImage();
          };

          // page to previous image
          scope.previous = function() {
              if (scope.current === 0) {
                  return;
              }
              scope.current -= 1;
              scope.loadImage();
          };

          // jump to first image
          scope.jumpToStart = function(){
              scope.current = 0;
              scope.loadImage();
          };

          // jump to last image
          scope.jumpToEnd = function(){
              scope.current = scope.itemData.images.length -1;
              scope.loadImage();
          };
          
          // rotate left
          scope.rotateLeft = function() {
              scope.currentRotation -= 90;
              //if (scope.currentRotation === -360) scope.currentRotation = 0;
              scope.setTransform();
          };

          // rotate right
          scope.rotateRight = function() {
              scope.currentRotation += 90;
              //if (scope.currentRotation === 360) scope.currentRotation = 0;
              scope.setTransform();
          };

          // zoom in 
          scope.zoomIn = function() {
              scope.getCurrentScale();
              scope.currentScale += scope.scaleStep;
              if (scope.currentScale > 3) {
                  scope.currentScale = 3;
              }
              scope.setTransform();
          };

          // zoom out
          scope.zoomOut = function() {
              scope.getCurrentScale();
              scope.currentScale -= scope.scaleStep;
              if (scope.currentScale < 1) {
                  scope.currentScale = 1;
              }
              scope.setTransform();
          };

          scope.setTransformOrigin = function() {
              if (scope.currentScale <= 2) {
                  scope.transformOrigin = 'center top';
              } else if (scope.currentScale > 2) {
                  scope.transformOrigin = 'left top';
              }
          };

          // set transform
          scope.setTransform = function() {
              scope.setTransformOrigin();
              scope.transform = {
                  '-webkit-transform': 'rotate(' + scope.currentRotation + 'deg) scale(' + scope.currentScale + ') ',
                  '-webkit-transform-origin': scope.transformOrigin,
                  '-moz-transform': 'rotate(' + scope.currentRotation + 'deg) scale(' + scope.currentScale + ') ',
                  '-moz-transform-origin': scope.transformOrigin,
                  '-ms-transform': 'rotate(' + scope.currentRotation + 'deg) scale(' + scope.currentScale + ') ',
                  '-ms-transform-origin': scope.transformOrigin,
                  '-o-transform': 'rotate(' + scope.currentRotation + 'deg) scale(' + scope.currentScale + ') ',
                  '-o-transform-origin': scope.transformOrigin,
                  'transform': 'rotate(' + scope.currentRotation + 'deg) scale(' + scope.currentScale + ') ',
                  'transform-origin': scope.transformOrigin,
                  '-webkit-transition': '0.3s ease-in-out',
                  '-moz-transition': '0.3s ease-in-out',
                  '-ms-transition': '0.3s ease-in-out',
                  '-o-transition': '0.3s ease-in-out',
                  'transition': '0.3s ease-in-out',
                  'max-height': '700px',
                  'width': 'auto'
              };
          };

          scope.getCurrentScale = function() {
              if (!scope.currentScale) {
                  var cp = angular.element(document.getElementById('contentPane'));
                  var im = angular.element(document.getElementById('largeImage'));
                  scope.currentScale = cp[0].clientWidth / im[0].clientWidth;
                  scope.setTransform();
              }
          };

          // highlight thumbnail
          scope.highlightThumbnail = function() {
              _.each(scope.smallImages, function(d, i) {
                  d.selected = '';
                  if (i === scope.current) {
                      d.selected = 'filmstrip-highlight-current';
                  }
              });
              scope.scrollThumbnails();
          };

          // toggle the filmstrip view
          scope.toggleFilmstrip = function() {
              scope.showFilmstrip = !scope.showFilmstrip;
              scope.smallImages = _.map(scope.itemData.thumbnails, function(d, i) { 
                  var selected = '';
                  if (i === scope.current) {
                      selected = 'filmstrip-highlight-current'; 
                  }
                  return {
                      'id': i,
                      'source': d,
                      'selected': selected
                  };
              });
              sizeThePanels();
              $timeout(function() {
                  scope.scrollThumbnails();
              }, 100);
          };

          scope.toggleItemInformation = function() {
              scope.showItemInformation = !scope.showItemInformation;
          };

          scope.jumpToPage = function(i) {
              scope.current = i;
              scope.loadImage();
          };

          scope.scrollThumbnails = function() {
              // scroll the thumbnails
              var old = $location.hash();
              $location.hash(scope.current);
              $anchorScroll();
              $location.hash(old);
          };

      }
    };
  }]);

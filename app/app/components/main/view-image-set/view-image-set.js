'use strict';

angular.module('pdsc')
  .directive('viewImageSet', [ 
    '$log', 
    '$window', 
    '$location', 
    '$anchorScroll', 
    '$timeout',  
    '_',
    '$mdSidenav',
    function ($log, $window, $location, $anchorScroll, $timeout, _, $mdSidenav) {
    return {
      templateUrl: 'app/components/main/view-image-set/view-image-set.html',
      restrict: 'E',
      scope: {
          itemData: '=',
          instanceId: '='
      },
      link: function postLink(scope) {
          // defaults
          scope.disableThumbnailView = false;
          scope.scaleStep = 0.2;
          scope.isOpen = false; 

          scope.$watch('itemData', function() {
              if (!_.isEmpty(scope.itemData)) {
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
              }
          });
          scope.$watch('current', function() {
              scope.loadImage();
          });

          scope.loadImage = function() {
              scope.currentScale = 1;
              scope.currentRotation = 0;
              scope.showImage = false;
              $timeout(function() {
                  scope.showProgress = true;
              }, 500);
              scope.image = scope.itemData.images[scope.current];
              scope.figureOutPaginationControls();
              //scope.highlightThumbnail();
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
              scope.setTransform();
          };

          // rotate right
          scope.rotateRight = function() {
              scope.currentRotation += 90;
              scope.setTransform();
          };


          // zoom in 
          scope.zoomIn = function() {
              scope.currentScale += scope.scaleStep;
              if (scope.currentScale > 3) {
                  scope.currentScale = 3;
              }
              scope.setTransform();
          };

          // zoom out
          scope.zoomOut = function() {
              scope.currentScale -= scope.scaleStep;
              if (scope.currentScale < 0.2) {
                  scope.currentScale = 0.2;
              }
              scope.setTransform();
          };

          scope.setTransformOrigin = function() {
              switch(scope.currentRotation) {
                  case 0:
                      scope.transformOrigin = 'left top';
                      break;
                  case -360:
                      scope.transformOrigin = 'left top';
                      break;
                  case 360:
                      scope.transformOrigin = 'left top';
                      break;
                  default:
                      scope.transformOrigin = 'center center';
                      break;
              }
          };

          // set transform
          scope.setTransform = function() {
              scope.setTransformOrigin();
              var transformation = 'rotate(' + scope.currentRotation + 'deg) scale(' + scope.currentScale + ')';
              scope.transform = {
                  '-webkit-transform': transformation,
                  //'-webkit-transform-origin': scope.transformOrigin,
                  '-moz-transform': transformation,
                  //'-moz-transform-origin': scope.transformOrigin,
                  '-ms-transform': transformation,
                  //'-ms-transform-origin': scope.transformOrigin,
                  '-o-transform': transformation,
                  //'-o-transform-origin': scope.transformOrigin,
                  'transform': transformation,
                  //'transform-origin': scope.transformOrigin,
                  '-webkit-transition': '0.3s ease-in-out',
                  '-moz-transition': '0.3s ease-in-out',
                  '-ms-transition': '0.3s ease-in-out',
                  '-o-transition': '0.3s ease-in-out',
                  'transition': '0.3s ease-in-out',
              };
          };

          // toggle the filmstrip view
          scope.toggleFilmstrip = function() {
              $mdSidenav('thumbnailFilmstrip').toggle();
          };

      }
    };
  }]);

'use strict';

/**
 * @ngdoc directive
 * @name pdscApp.directive:viewDocuments
 * @description
 * # viewDocuments
 */
angular.module('pdscApp')
  .directive('viewDocuments', [ '$sce', '$window', function ($sce, $window) {
    return {
      templateUrl: 'views/view-documents.html',
      restrict: 'E',
      scope: {
          itemData: '=',
      },
      link: function postLink(scope, element, attrs) {

          var canvasId = 'the-canvas';
          scope.showDocuments = true;
          scope.showItemInformation = false;
          scope.pdfInfo = {};

          // first page
          //  pages count from 1 - NOT 0
          scope.current = 1;

          // initial scale
          scope.scale = 1;

          // handle window resize events
          var w = angular.element($window);
          w.bind('resize', function() {
              scope.$apply(function() {
                sizeThePanels();
              })
          });

          var sizeThePanels = function() {
              scope.pdfPanelStyle = {
                  'position': 'absolute',
                  'height': $window.innerHeight - 100,
                  'padding': '0px 0px 0px 0px',
                  'border': '0',
                  'overflow': 'scroll'

              }
          }
          sizeThePanels();

          var loadDocument = function() {
              var d = scope.itemData.documents[0].replace('catalog.paradisec.org.au', 'catalog.pdsc');
              scope.d = $sce.trustAsResourceUrl(scope.itemData.documents[0]);
              //
              // Fetch the PDF document from the URL using promises
              //
              PDFJS.imageResourcePath = 'images/';
              PDFJS.cMapUrl = 'cmaps/';
              PDFJS.cMapPacked = true;
              PDFJS.disableWorker = true;
              PDFJS.disableRange = true;
              var what = {
                  'url': scope.itemData.documents[0],
                  'withCredentials': true
              }

              PDFJS.getDocument(what).then(function(pdf) {
                  scope.pdf = pdf;
                  scope.getDocumentMetadata();

                  scope.loadPage();

              });
          }

          scope.getDocumentMetadata = function() {
              scope.pdf.getMetadata().then(function(data) {
                  scope.$apply(function() {
                      scope.pdfInfo.totalPages = scope.pdf.numPages;
                      scope.pdfInfo.metadata = data;
                  });
              })
          }
          scope.loadPage = function() {
              // Using promise to fetch the page
              scope.pdf.getPage(scope.current).then(function(page) {
                var viewport = page.getViewport(scope.scale);

                //
                // Prepare canvas using PDF page dimensions
                //
                var canvas = document.getElementById(canvasId);
                var context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                //
                // Render PDF page into canvas context
                //
                var renderContext = {
                  canvasContext: context,
                  viewport: viewport
                };
                page.render(renderContext);
              });
          }

          scope.zoomIn = function() {
              scope.scale += 0.5;
              if (scope.scale > 3) scope.scale = 3;
              scope.loadPage();
          }
          scope.zoomOut = function() {
              scope.scale -= 0.5;
              if (scope.scale < 1) scope.scale = 1;
              scope.loadPage();
          }
          scope.nextPage = function() {
              scope.current += 1;
              if (scope.current > scope.pdf.numPages) scope.current = scope.pdf.numPages;
              scope.loadPage();
          }
          scope.previousPage = function() {
              if (!scope.pdf) return;
              scope.current -= 1;
              if (scope.current < 1) scope.current = 1;
              scope.loadPage();
          }
          scope.firstPage = function() {
              if (!scope.pdf) return;
              scope.current = 1;
              scope.loadPage();
          }
          scope.lastPage = function() {
              if (!scope.pdf) return;
              scope.current = scope.pdf.numPages;
              scope.loadPage();
          }

          // load the document
          loadDocument();
      }
    };
  }]);

'use strict';

angular.module('pdsc')
  .directive('viewDocuments', [ 
    '$sce', 
    '$window', 
    '_',
    'pdfjs',
    function ($sce, $window, _, pdfjs) {
    return {
      templateUrl: 'app/components/main/view-documents/view-documents.html',
      restrict: 'E',
      scope: {
          itemData: '=',
          instanceId: '='
      },
      link: function postLink(scope) {

          var canvasId = 'the-canvas';
          scope.showDocuments = true;
          scope.showItemInformation = false;
          scope.pdfInfo = {};

          // is a specific instance being requested? If so - strip the others
          //  from the set. Support the instance being defined by the name 
          if (scope.instanceId) {
              // it's not undefined
              scope.itemData.documents = _.filter(scope.itemData.documents, function(d) {
                  return d.match(scope.instanceId);
              });
          }

          // first document
          //  documents count from zero - the array index
          scope.doc = 0;

          // initial scale - depends on window width
          if ($window.innerWidth < 780) {
              scope.scale = 0.5;
          } else if ($window.innerWidth > 780 && $window.innerWidth < 1030) {
              scope.scale = 1;
          } else {
              scope.scale = 1.5;
          }
          scope.scale = 0.5;

          // handle window resize events
          var w = angular.element($window);
          w.bind('resize', function() {
              scope.$apply(function() {
                sizeThePanels();
              });
          });

          var sizeThePanels = function() {
              scope.pdfPanelStyle = {
                  'position': 'absolute',
                  'height': '600px',
                  'overflow': 'auto'

              };
          };
          sizeThePanels();

          var loadDocument = function() {
              //
              // Fetch the PDF document from the URL using promises
              //
              pdfjs.imageResourcePath = 'images/';
              pdfjs.cMapUrl = 'cmaps/';
              pdfjs.cMapPacked = true;
              pdfjs.disableWorker = true;
              pdfjs.disableRange = true;

              var what = {
                  'url': $sce.trustAsResourceUrl(scope.itemData.documents[scope.doc]),
                  'withCredentials': true
              };

              // first page
              //  pages count from 1 - NOT 0
              // When loading a document, always start at the beginning
              scope.current = 1;

              pdfjs.getDocument(what).then(function(pdf) {
                  scope.pdf = pdf;
                  scope.getDocumentMetadata();

                  scope.loadPage();

              });
          };

          scope.getDocumentMetadata = function() {
              scope.pdf.getMetadata().then(function(data) {
                  scope.$apply(function() {
                      scope.pdfInfo.totalPages = scope.pdf.numPages;
                      scope.pdfInfo.metadata = data;
                  });
              });
          };
          scope.loadPage = function() {
              // Using promise to fetch the page
              scope.pdf.getPage(scope.current).then(function(page) {
                var viewport = page.getViewport(scope.scale);
                console.log(viewport);

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
          };

          scope.nextDocument = function() {
              scope.doc += 1;
              if (scope.doc === scope.itemData.documents.length) {
                  scope.doc = scope.itemData.documents.length;
              }
              loadDocument();
          };
          scope.previousDocument = function() {
              scope.doc -= 1;
              if (scope.doc < 0) {
                  scope.doc = 0;
              }
              loadDocument();
          };

          scope.zoomIn = function() {
              scope.scale += 0.5;
              if (scope.scale > 3) {
                  scope.scale = 3;
              }
              scope.loadPage();
          };
          scope.zoomOut = function() {
              scope.scale -= 0.5;
              if (scope.scale < 0.5) {
                  scope.scale = 0.5;
              }
              scope.loadPage();
          };
          scope.nextPage = function() {
              scope.current += 1;
              if (scope.current > scope.pdf.numPages) {
                  scope.current = scope.pdf.numPages;
              }
              scope.loadPage();
          };
          scope.previousPage = function() {
              if (!scope.pdf) {
                  return;
              }
              scope.current -= 1;
              if (scope.current < 1) {
                  scope.current = 1;
              }
              scope.loadPage();
          };
          scope.firstPage = function() {
              if (!scope.pdf) {
                  return;
              }
              scope.current = 1;
              scope.loadPage();
          };
          scope.lastPage = function() {
              if (!scope.pdf) {
                  return;
              }
              scope.current = scope.pdf.numPages;
              scope.loadPage();
          };

          // load the document
          loadDocument();
      }
    };
  }]);

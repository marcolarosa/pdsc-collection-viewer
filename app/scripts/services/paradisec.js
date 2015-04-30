'use strict';

/**
 * @ngdoc service
 * @name pdscApp.paradisec
 * @description
 * # paradisec
 * Service in the pdscApp.
 */
angular.module('pdscApp')
  .service('paradisec', [ '$log', '$http', 'xml', 'configuration', function ($log, $http, xml, conf) {

      function getNodes(d) {
          var parser = new DOMParser();
          var xmldoc = parser.parseFromString(d, "text/xml");
          return { 'tree': xml.toJson(xmldoc) }
      }

      function getItem(project, itemId) {
          var url = conf.datasource[project].getItem;
          url = url.replace('{{itemId}}', itemId);
          $log.debug("ParadisecService: getItem", url);

          return $http.get(url, { transformResponse: getNodes }).then(function(resp) {
              $log.debug("ParadisecService: getItem response", resp.data.tree);
              return resp.data.tree;
          }, 
          function(resp) {
              $log.error("ParadisecService: error, couldn't get", url);
          });
      }

      var paradisec = {
          itemData: {},
          getItem: getItem
      }
      return paradisec;
  }]);

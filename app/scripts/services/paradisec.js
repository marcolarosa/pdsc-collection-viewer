'use strict';

/**
 * @ngdoc service
 * @name pdscApp.paradisec
 * @description
 * # paradisec
 * Service in the pdscApp.
 */
angular.module('pdscApp')
  .service('paradisec', [ '$log', 'configuration', function ($log, conf) {

      function getItem(project, itemId) {
          $log.debug("ParadisecService: getItem", conf.datasource[project].getItem);
          var getItem = conf.datasource[project].getItem;
          getItem = getItem.replace('{{itemId}}', itemId);
          $log.info("ParadisecService: getItem", getItem);
      }

      var paradisec = {
          getItem: getItem
      }
      return paradisec;
  }]);

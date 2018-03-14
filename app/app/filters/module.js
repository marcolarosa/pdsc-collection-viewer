'use strict';

module.exports = angular
  .module('pdsc.filters', [])
  .filter('extension', require('./extension.filter'))
  .filter('minutesSeconds', require('./minutes-seconds.filter'))
  .filter('notEmpty', require('./not-empty.filter'))
  .filter('stripTime', require('./strip-time.filter'))
  .filter('trustAsHtml', require('./trust-as-html.filter'))
  .filter('escapeHtml', require('./escape-html.filter'));

'use strict';

module.exports = [
  '$sce',
  $sce => {
    return input => {
      return $sce.trustAsResourceUrl(input);
    };
  }
];

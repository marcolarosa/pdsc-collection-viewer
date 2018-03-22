'use strict';

module.exports = [
  'lodash',
  lodash => {
    return input => {
      return !lodash.isEmpty(input) ? true : false;
    };
  }
];

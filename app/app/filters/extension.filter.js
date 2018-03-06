'use strict';

module.exports = [
  () => {
    return input => {
      var c = input.split('/').pop();
      return c.split('.')[1];
    };
  }
];

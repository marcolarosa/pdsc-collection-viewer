'use strict';

module.exports = XMLDataLoader;

XMLDataLoader.$inject = [];

function XMLDataLoader() {
  const data = {
    AC1: {
      '013-B': {
        eaf: require('./test-data/AC1-013-B.eaf')
      }
    }
  };
  return data;
}

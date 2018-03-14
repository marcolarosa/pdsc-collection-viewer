'use strict';

module.exports = [
  () => {
    var entityMap = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
      '/': '&#x2F;'
    };

    return str => {
      return String(str).replace(/[&<>"'\/]/g, function(s) {
        return entityMap[s];
      });
    };
  }
];

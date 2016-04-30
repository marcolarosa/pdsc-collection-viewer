'use strict';

// give me moment
angular.module('moment', []).factory('moment', function() {
    return window.moment;
});

// give me underscore
angular.module('underscore', []).factory('_', function() {
    return window._;
});

// give me PDFJS
angular.module('pdfjs', []).factory('pdfjs', function() {
    return window.PDFJS;
});

// give me clipboard
angular.module('clipboard', []).factory('clipboard', function() {
    return window.clipboard;
});

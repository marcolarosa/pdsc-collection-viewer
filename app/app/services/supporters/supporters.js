'use strict';

// give me moment
angular.module('moment', []).factory('moment', function() {
    return window.moment;
});

// give me underscore
angular.module('underscore', []).factory('_', function() {
    return window._;
});

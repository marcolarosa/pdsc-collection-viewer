'use strict';

describe('Filter: strip-time', function () {
    var stripTime;

    beforeEach(module('pdsc'));
    beforeEach(inject(function(_$filter_) {
        stripTime = _$filter_('stripTime');
    }));

    it('should return the leading component', function() {
        expect(stripTime('2015-01-03#12:34')).toBe('2015-01-03');
    });

});

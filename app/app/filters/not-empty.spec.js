'use strict';

describe('Filter: not-empty', function () {
    var notEmpty;

    beforeEach(module('pdsc'));
    beforeEach(inject(function(_$filter_) {
        notEmpty = _$filter_('notEmpty');
    }));

    it('should return false', function() {
        expect(notEmpty([])).toBe(false);
        expect(notEmpty('')).toBe(false);
        expect(notEmpty()).toBe(false);
    });

    it('should return true', function() {
        expect(notEmpty('marco')).toBe(true);
        var something = 'banana';
        expect(notEmpty(something)).toBe(true);
    });
});

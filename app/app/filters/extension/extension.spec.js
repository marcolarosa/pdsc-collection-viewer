'use strict';

describe('Filter: extension', function () {
    var extension;

    beforeEach(module('pdsc'));
    beforeEach(inject(function(_$filter_) {
        extension = _$filter_('extension');
    }));

    it('should return the file extension', function() {
        expect(extension('/path/to/AC1-VUNU105-001.JPG')).toBe('JPG');
        expect(extension('/path/to/AC1-VUNU105-001.mp3')).toBe('mp3');
        expect(extension('/path/to/AC1-VUNU105-001.pdf')).toBe('pdf');
    });

});

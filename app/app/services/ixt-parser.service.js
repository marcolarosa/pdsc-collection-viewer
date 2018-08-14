"use strict";

module.exports = IXTParserService;

IXTParserService.$inject = ["lodash"];
function IXTParserService(lodash) {
    var ixtParser = {};

    // parse an ixt XML file and return an object keyed on timeslot id
    ixtParser.parse = function(data) {
        var text = lodash.map(data.eopas.interlinear.phrase, function(d) {
            var words = lodash.map(d.wordlist.word, function(w) {
                try {
                    if (!lodash.isArray(w.morphemelist.morpheme)) {
                        w.morphemelist.morpheme = [w.morphemelist.morpheme];
                    }
                } catch (e) {
                    return {};
                }
                var word = lodash.map(w.morphemelist.morpheme, function(m) {
                    return {
                        morpheme: m.text[0]["#text"],
                        gloss: m.text[1]["#text"]
                    };
                });
                w = {
                    text: w.text["#text"],
                    words: word
                };
                return w;
            });
            return {
                id: d["@attributes"].startTime ? d["@attributes"].startTime : 0,
                transcription: d.transcription["#text"],
                translation: d.translation["#text"],
                time: {
                    begin: parseFloat(d["@attributes"].startTime)
                },
                words: words
            };
        });
        return text;
    };

    return ixtParser;
}

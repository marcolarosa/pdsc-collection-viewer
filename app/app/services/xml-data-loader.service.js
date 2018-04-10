'use strict';

module.exports = XMLDataLoader;

XMLDataLoader.$inject = [];

function XMLDataLoader() {
  const data = {
    'AA2-003.xml': require('./test-data/AA2-003.xml'),
    'AC1-013-B.eaf': require('./test-data/AC1-013-B.eaf'),
    'AC1-013.xml': require('./test-data/AC1-013.xml'),
    'AC2-ETHGS102.xml': require('./test-data/AC2-ETHGS102.xml'),
    'AC2-VUNU105.xml': require('./test-data/AC2-VUNU105.xml'),
    'BN1-001-A.trs': require('./test-data/BN1-001-A.trs'),
    'BN1-001.xml': require('./test-data/BN1-001.xml'),
    'NT1-98007-98007A.eaf': require('./test-data/NT1-98007-98007A.eaf'),
    'NT1-98007-98007A.flextext': require('./test-data/NT1-98007-98007A.flextext'),
    'NT1-98007-98007A.ixt': require('./test-data/NT1-98007-98007A.ixt'),
    'NT1-98007-98007A.trs': require('./test-data/NT1-98007-98007A.trs'),
    'NT1-98007.xml': require('./test-data/NT1-98007.xml'),
    'NT5-DickLauto.xml': require('./test-data/NT5-DickLauto.xml'),
    'NT10-W08-A.trs': require('./test-data/NT10-W08-A.trs'),
    'NT10-W08-B.trs': require('./test-data/NT10-W08-B.trs'),
    'NT10-W13.xml': require('./test-data/NT10-W13.xml')
  };
  return data;
}

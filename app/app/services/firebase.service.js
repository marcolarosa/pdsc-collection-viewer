'use strict';

const firebase = require('firebase');
const moment = require('moment');

module.exports = FirebaseService;

FirebaseService.$inject = [];
function FirebaseService() {
  init();
  var fbs = {
    getDatabase,
    getLanguageData
  };
  return fbs;

  function init() {
    const config = {
      apiKey: 'AIzaSyCXbc9i8PAFZgxlYpFCT70r8To3MU2sWD8',
      authDomain: 'psdc-olac-languages.firebaseapp.com',
      databaseURL: 'https://psdc-olac-languages.firebaseio.com',
      projectId: 'psdc-olac-languages',
      storageBucket: 'psdc-olac-languages.appspot.com',
      messagingSenderId: '1049884986765'
    };
    firebase.initializeApp(config);
  }

  function getDatabase() {
    return firebase.database();
  }

  function getLanguageData(code) {
    const today = moment().format('YYYY-MM-DD');
    const ref = `/languageData/${today}/${code[0]}/${code[1]}/${code}`;
    return firebase.database().ref(ref);
  }
}

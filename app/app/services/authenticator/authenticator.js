'use strict';

angular.module('pdsc')
  .service('authenticator', [ 
    '$log', 
    '$firebaseAuth', 
    '$firebaseObject', 
    'configuration', 
    function ($log, $firebaseAuth, $firebaseObject, conf) {
    // AngularJS will instantiate a singleton by calling "new" on this function


    // is the user authenticated
    function isAuthenticated() {
        return authenticator.auth.$getAuth();
    }

    // authentication handler
    function authSucceeded(data) {
        $log.info('Authentication succeeded.', data);

        // ensure we have a profile for the user
        var obj = $firebaseObject(new Firebase(conf.firebase + 'users/' + data.uid));
        obj.givenName = data[data.provider].cachedUserProfile.given_name;
        obj.familyName = data[data.provider].cachedUserProfile.family_name;
        obj.provider = data.provider;
        obj.id = data.uid;
        obj.$save();
    }
    function authFailed(error) {
        $log.error('Authentication Failed!', error);
    }

    // google auth
    function authGoogle() {
        var a = authenticator.auth;
        a.$authWithOAuthPopup('google').then(authSucceeded).catch(authFailed);
    }

    // logout of firebase
    function logout() {
        authenticator.auth.$unauth();
    }

    var authenticator = {
        fb: new Firebase(conf.firebase),
        isAuthenticated: isAuthenticated,
        authGoogle: authGoogle,
        logout: logout
    }
    authenticator.auth = $firebaseAuth(authenticator.fb);
    return authenticator;
  }]);

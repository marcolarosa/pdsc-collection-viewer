// Karma configuration
// http://karma-runner.github.io/0.12/config/configuration-file.html
// Generated on 2015-11-28 using
// generator-karma 1.0.1

module.exports = function(config) {
  'use strict';

  config.set({
    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // base path, that will be used to resolve files and exclude
    basePath: '../',

    // coverage reporter generates the coverage
    reporters: ['progress', 'coverage'],

    // optionally, configure the reporter
    coverageReporter: {
        type : 'html',
        dir  : 'coverage/',
    },

    // testing framework to use (jasmine/mocha/qunit/...)
    // as well as any additional frameworks (requirejs/chai/sinon/...)
    frameworks: [
      "jasmine"
    ],

    // list of files / patterns to load in the browser
    files: [
      // bower:js
      'bower_components/angular/angular.js',
      'bower_components/angular-animate/angular-animate.js',
      'bower_components/angular-cookies/angular-cookies.js',
      'bower_components/angular-messages/angular-messages.js',
      'bower_components/angular-resource/angular-resource.js',
      'bower_components/angular-route/angular-route.js',
      'bower_components/angular-sanitize/angular-sanitize.js',
      'bower_components/underscore/underscore.js',
      'bower_components/underscore-contrib/dist/underscore-contrib.min.js',
      'bower_components/pdfjs-dist/build/pdf.combined.js',
      'bower_components/pdfjs-dist/web/compatibility.js',
      'bower_components/moment/moment.js',
      'bower_components/angular-aria/angular-aria.js',
      'bower_components/angular-material/angular-material.js',
      'bower_components/clipboard/dist/clipboard.js',
      'bower_components/angular-mocks/angular-mocks.js',
      // endbower
      "app/app/*.js",
      "app/app/components/**/*.js",
      "app/app/components/**/*.html",
      "app/app/services/**/*.js",
      "app/app/filters/**/*.js",
      "app/app/test-data/**/*.js"
    ],

    // list of files / patterns to exclude
    exclude: [
    ],

    // web server port
    port: 8080,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: [
    ],

    // Which plugins to enable
    plugins: [
      //"karma-phantomjs-launcher",
      "karma-jasmine",
      "karma-coverage",
      "karma-firefox-launcher",
      "karma-chrome-launcher",
      "karma-ng-html2js-preprocessor"
    ],

    preprocessors: {
        'app/app/components/**/*.html':['ng-html2js'],
        'app/**/*.js': ['coverage']
    },
    ngHtml2JsPreprocessor: { 
        stripPrefix: 'app/', 
        moduleName: 'my.templates'
    },

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false,

    colors: true,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,

    // Uncomment the following lines if you are using grunt's server to run the tests
    // proxies: {
    //   '/': 'http://localhost:9000/'
    // },
    // URL root prevent conflicts with the site root
    // urlRoot: '_karma_'
  });
};

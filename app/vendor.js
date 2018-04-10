'use strict';

import '../node_modules/font-awesome/css/font-awesome.css';
import '../node_modules/angular-material/angular-material.css';
import './assets/css/app.css';
import '../node_modules/ImageViewer/imageviewer.css';
import '../node_modules/highlight.js/styles/atom-one-dark.css';

require('angular');
require('angular-animate');
require('angular-aria');
require('angular-cookies');
require('angular-material');
require('angular-messages');
require('angular-sanitize');
require('@uirouter/angularjs');
require('moment');
require('lodash');
require('pdfjs-dist');
require('jquery');
require('../node_modules/ImageViewer/imageviewer.js');
require('highlight.js');

import pdflib from 'pdfjs-dist';
pdflib.PDFJS.workerSrc = 'lib/pdf.worker.min.js';

const Clipboard = require('clipboard');
const clipboard = new Clipboard('button');

'use strict';

const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const WebpackShellPlugin = require('webpack-shell-plugin');

module.exports = merge(common, {
  devtool: 'eval-source-map',
  mode: 'development',
  plugins: [
    new WebpackShellPlugin({
      onBuildExit: ['./node_modules/karma/bin/karma start karma.conf.js'],
      safe: true
    })
  ],
  watch: true
});

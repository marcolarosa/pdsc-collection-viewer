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
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'ifdef-loader',
            options: {
              DEPLOY_TESTING: false,
              DEPLOY_PRODUCTION: false
            }
          },
          {loader: 'babel-loader?presets[]=es2015'}
        ],
        exclude: /node_modules|bower_components/
      }
    ]
  },

  watch: true
});

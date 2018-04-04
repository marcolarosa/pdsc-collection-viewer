'use strict';

const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  cache: true,
  devtool: 'eval-source-map',
  mode: 'development',
  devServer: {
    contentBase: './dist',
    host: '0.0.0.0',
    port: '9000',
    watchContentBase: true,
    disableHostCheck: true
  },
  plugins: [new webpack.NamedModulesPlugin()]
});

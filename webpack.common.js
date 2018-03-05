'use strict';

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: {
    vendor: './app/vendor.js',
    app: './app/app.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js'
  },
  target: 'web',
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      title: 'Nabu Collection Viewer'
    })
  ],
  module: {
    noParse: [/dtrace-provider/, /safe-json-stringify/, /mv/],
    rules: [{test: /\.css$/, use: 'css-loader'}]
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname, 'src')
    }
  }
};

'use strict';

const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const WriteFilePlugin = require('write-file-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = merge(common, {
  cache: true,
  devtool: 'eval-source-map',
  mode: 'development',
  output: {
    path: path.join(__dirname, './dist')
  },
  devServer: {
    contentBase: './dist',
    host: '0.0.0.0',
    port: '9000',
    watchContentBase: true,
    disableHostCheck: true
  },
  plugins: [
    new CleanWebpackPlugin(['dist/'], {
      watch: true,
      root: __dirname,
      exclude: ['Shared']
    }),
    new webpack.NamedModulesPlugin(),
    new WriteFilePlugin(),
    new webpack.DefinePlugin({
      'process.env.MODE': JSON.stringify('online')
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
  }
});

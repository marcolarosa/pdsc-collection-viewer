'use strict';

const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  devtool: 'nosources-source-map',
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/test-viewer/',
    filename: '[name].[chunkHash].bundle.js'
  },
  plugins: [
    new UglifyJSPlugin({sourceMap: true}),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
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
              DEPLOY_TESTING: true,
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

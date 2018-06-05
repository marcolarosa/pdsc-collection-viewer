'use strict';

const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  devtool: 'none',
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/viewer/',
    filename: '[name].[chunkHash].bundle.js'
  },
  plugins: [
    new CleanWebpackPlugin(['dist/'], {watch: true}),
    new UglifyJSPlugin({sourceMap: true}),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
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
              DEPLOY_PRODUCTION: true
            }
          },
          {loader: 'babel-loader?presets[]=es2015'}
        ],
        exclude: /node_modules|bower_components/
      }
    ]
  }
});

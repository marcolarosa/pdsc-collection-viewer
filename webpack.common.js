'use strict';

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    vendor: './app/vendor.js',
    app: './app/app.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[hash].[name].bundle.js'
  },
  target: 'web',
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Nabu Collection Viewer',
      template: './app/index.html'
    }),
    new CleanWebpackPlugin(['dist/*'], {
      watch: true
    }),
    new CopyWebpackPlugin(
      [
        {
          from: './node_modules/pdfjs-dist/build/pdf.worker.min.js',
          to: './lib/'
        }
      ],
      {}
    )
  ],
  module: {
    rules: [
      {
        test: /\.(html|xml|eaf|trs|ixt|flextext)$/,
        loader: 'raw-loader'
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.js$/,
        loader: 'babel-loader?presets[]=es2015',
        exclude: /node_modules|bower_components/
      },
      {
        test: /\.(woff|woff2|ttf|eot|svg)(\?]?.*)?$/,
        loader: 'file-loader?name=res/[name].[ext]?[hash]'
      }
    ]
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname, 'src'),
      jquery: 'jquery/src/jquery'
    }
  }
};

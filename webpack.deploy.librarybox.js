"use strict";

const path = require("path");
const webpack = require("webpack");
const merge = require("webpack-merge");
const common = require("./webpack.common.js");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");

module.exports = merge(common, {
    devtool: "none",
    mode: "production",
    output: {
        publicPath: "/"
    },
    plugins: [
        new CleanWebpackPlugin(["dist/"], {
            watch: true,
            root: __dirname
        }),
        new UglifyJSPlugin(),
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify("production"),
            "process.env.MODE": JSON.stringify("librarybox")
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "ifdef-loader",
                        options: {
                            DEPLOY_TESTING: false,
                            DEPLOY_PRODUCTION: true
                        }
                    },
                    {
                        loader: "babel-loader",
                        options: { presets: "env" }
                    }
                ]
            }
        ]
    }
});

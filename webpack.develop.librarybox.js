"use strict";

const path = require("path");
const webpack = require("webpack");
const merge = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
    devtool: "eval-source-map",
    mode: "development",
    // stats: "verbose",
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        compress: true,
        host: "0.0.0.0",
        port: 9000,
        historyApiFallback: true,
        watchContentBase: true
    },
    plugins: [
        new webpack.DefinePlugin({
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
                            DEPLOY_PRODUCTION: false
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

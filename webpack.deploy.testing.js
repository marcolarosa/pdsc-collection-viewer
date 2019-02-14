"use strict";

const path = require("path");
const webpack = require("webpack");
const merge = require("webpack-merge");
const common = require("./webpack.common.js");
const CleanWebpackPlugin = require("clean-webpack-plugin");

module.exports = merge(common, {
    devtool: "none",
    mode: "production",
    output: {
        publicPath: "/test-viewer/"
    },
    plugins: [
        new CleanWebpackPlugin(["dist/"], {
            watch: true,
            root: __dirname
        }),
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify("production"),
            "process.env.MODE": JSON.stringify("online")
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
                            DEPLOY_TESTING: true,
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

"use strict";

const path = require("path");
const webpack = require("webpack");
const merge = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
    devtool: "eval-source-map",
    mode: "development",
    // stats: "verbose",
    serve: {
        host: "0.0.0.0",
        port: "9000",
        content: "./dist",
        devMiddleware: {
            writeToDisk: true
        },
        hotClient: {
            allEntries: true,
            host: {
                server: "192.168.56.2",
                client: "192.168.56.2"
            }
        }
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

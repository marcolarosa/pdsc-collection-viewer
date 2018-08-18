"use strict";

const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    entry: {
        app: "./app/app/app.module.js",
        vendor: "./app/vendor.js"
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].[hash].js"
    },
    optimization: {
        splitChunks: {
            chunks: "all",
            cacheGroups: {
                styles: {
                    name: "styles",
                    test: /\.css$/,
                    chunks: "all",
                    enforce: true
                }
            }
        }
    },
    target: "web",
    plugins: [
        new CleanWebpackPlugin(["dist/"], {
            watch: true,
            root: __dirname,
            exclude: ["Shared", "www"]
        }),
        new MiniCssExtractPlugin({
            filename: "[name].[contenthash].css"
        }),
        new HtmlWebpackPlugin({
            title: "Nabu Collection Viewer",
            template: "./app/index.html"
        }),
        new CopyWebpackPlugin(
            [
                {
                    from: "./node_modules/pdfjs-dist/build/pdf.worker.min.js",
                    to: "./lib/"
                }
            ],
            {}
        )
    ],
    module: {
        rules: [
            {
                test: /\.(html|xml|eaf|trs|ixt|flextext)$/,
                loader: "raw-loader"
            },
            {
                test: /\.css$/,
                use: [{ loader: MiniCssExtractPlugin.loader }, "css-loader"]
            },
            {
                test: /\.(woff|woff2|ttf|eot|svg)(\?]?.*)?$/,
                loader: "file-loader?name=res/[name].[ext]?[hash]"
            }
        ]
    },
    resolve: {
        alias: {
            app: path.resolve(__dirname, "app/app"),
            services: path.resolve(__dirname, "app/app/services")
            jquery: "jquery/src/jquery"
        }
    }
};

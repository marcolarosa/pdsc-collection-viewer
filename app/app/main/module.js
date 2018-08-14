"use strict";

import "./main.css";

module.exports = angular
    .module("pdsc.main", [])
    .constant("configuration", require("./configuration"))
    .controller("MetadataCtrl", require("./metadata.controller"))
    .component("pdscCollectionViewerRootComponent", require("./root.component"))
    .component("pdscCollectionViewerMainComponent", require("./main.component"))
    .directive("sizeToParent", require("./size-to-parent.directive"))
    .directive("blurOnClick", require("./blur-on-click.directive"))
    .directive("storeHeight", require("./store-height.directive"));

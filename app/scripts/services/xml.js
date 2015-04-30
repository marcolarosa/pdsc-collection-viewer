'use strict';

/**
 * @ngdoc service
 * @name pdscApp.xml
 * @description
 * # xml
 * Service in the pdscApp.
 */
angular.module('pdscApp')
  .service('xml', function () {

      // http://davidwalsh.name/convert-xml-json
      // Changes XML to JSON
      function toJson(xml) {
          // Create the return object
          var obj = {};

          if (xml.nodeType == 1) { // element
              // do attributes
              if (xml.attributes.length > 0) {
              obj["@attributes"] = {};
                  for (var j = 0; j < xml.attributes.length; j++) {
                      var attribute = xml.attributes.item(j);
                      obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
                  }
              }
          } else if (xml.nodeType == 3) { // text
              obj = xml.nodeValue;
          }

          // do children
          if (xml.hasChildNodes()) {
              for(var i = 0; i < xml.childNodes.length; i++) {
                  var item = xml.childNodes.item(i);
                  var nodeName = item.nodeName;
                  if (typeof(obj[nodeName]) == "undefined") {
                      obj[nodeName] = toJson(item);
                  } else {
                      if (typeof(obj[nodeName].push) == "undefined") {
                          var old = obj[nodeName];
                          obj[nodeName] = [];
                          obj[nodeName].push(old);
                      }
                      obj[nodeName].push(toJson(item));
                  }
              }
          }
          return obj;
      }

      var xml = {
          toJson: toJson,
      }
      return xml;
  });

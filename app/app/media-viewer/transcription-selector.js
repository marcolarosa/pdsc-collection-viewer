"use strict";

angular.module("pdsc").directive("transcriptionSelector", [
  "_",
  function(_) {
    return {
      templateUrl: "./transcription-selector.html",
      restrict: "E",
      link: function postLink(scope) {
        scope.transcript = {
          selected: undefined
        };

        var interlinear = _.flatten([
          scope.itemData.flextext[scope.name],
          scope.itemData.ixt[scope.name]
        ]);
        var transcription = _.flatten([
          scope.itemData.eaf[scope.name],
          scope.itemData.trs[scope.name]
        ]);
        interlinear = _.compact(interlinear);
        transcription = _.compact(transcription);

        if (!_.isEmpty(interlinear) && !_.isEmpty(transcription)) {
          scope.loadSelector = true;
        } else {
          scope.loadSelector = false;
          if (_.isEmpty(interlinear) && !_.isEmpty(transcription)) {
            scope.showTranscription = true;
            scope.showInterlinear = false;
          } else if (!_.isEmpty(interlinear) && _.isEmpty(transcription)) {
            scope.showTranscription = false;
            scope.showInterlinear = true;
          }
        }

        scope.$watch("transcript.selected", function() {
          if (scope.transcript.selected === "transcription") {
            scope.showTranscription = true;
            scope.showInterlinear = false;
          } else if (scope.transcript.selected === "interlinear") {
            scope.showTranscription = false;
            scope.showInterlinear = true;
          }
        });
      }
    };
  }
]);

'use strict';

module.exports = angular
  .module('pdsc.mediaViewer', [])
  .directive('mediaReady', require('./media-ready.directive'))
  .directive('timeUpdate', require('./time-update.directive'))
  .component('pdscMediaViewerComponent', require('./view-media.component'))
  .component('pdscAudioPlayerComponent', require('./audio-element.component'))
  .component('pdscVideoPlayerComponent', require('./video-element.component'))
  .component(
    'pdscTranscriptionRenderComponent',
    require('./render-transcription.component')
  )
  .component(
    'pdscFragmentCitationComponent',
    require('./fragment-citation.component')
  );

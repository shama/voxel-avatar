if (!window.URL) {
  window.URL = window.webkitURL || window.msURL || window.oURL;
}
if (!navigator.getUserMedia) {
  navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
}

function Avatar(THREE, opts) {
  if (!(this instanceof Avatar)) return new Avatar(THREE, opts || {});
  this.THREE = THREE;
  this.opts = opts || {};
  this.fps = opts.fps || 1000 / 30;
  this.size = opts.size || 8;
  this.width = opts.width || 320;
  this.height = opts.height || 240;
  this.zoom = opts.zoom !== false;
  this.stream = null;
}
module.exports = Avatar;

Avatar.prototype.onSkin = function(skin, data) {
  var self = this;

  // if from voxel-player
  if (skin.playerSkin) skin = skin.playerSkin;

  var size = self.size * skin.sizeRatio;

  var video = document.createElement('video');
  video.width = this.width;
  video.height = this.height;
  video.autoplay = true;

  function play() {
    (function loop() {
      if (video.paused || video.ended) return;

      if (self.zoom === false) {
        skin.skinBig.getContext('2d').drawImage(video, size, size, size, size);
      } else {
        skin.skinBig.getContext('2d').drawImage(
          video,
          self.width / 2, self.height / 2,
          self.width, self.height,
          size, size, size, size
        );
      }

      skin.head.material.map.image = skin.skinBig;
      skin.head.material.map.needsUpdate = true;
      setTimeout(loop, self.fps);
    }());
  }
  video.addEventListener('play', play);

  // Load video
  if (!data) {
    navigator.getUserMedia({video: true, audio: true}, function(stream) {
      self.stream = stream;
      video.src = window.URL.createObjectURL(stream);
    }, function(err) {
      console.error('Failed to get a stream due to', err);
    });
  } else {
    // TODO: Also accept images, like from gravatar
    video.src = data;
  }

  return video;
};

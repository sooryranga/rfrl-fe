<template>
    <div>
        <div class="camera">
            <video id="video">Video stream not available.</video>
            <button id="startbutton">Take photo</button>
        </div>
        <canvas id="canvas">
          <div class="output">
            <img id="photo" alt="The screen capture will appear in this box.">
          </div>
        </canvas>
        <instant-messaging></instant-messaging>
    </div>
</template>

<script>
export default {
  name: 'video-conference',
  data: function() {
    return {
      video: null,
      canvas: null,
      photo: null,
      startbutton: null,
      streaming: null,
      height: 0,
      width: 320,
    };
  },
  mounted: function() {
    this.video = document.getElementById('video');
    console.log(this.video);
    this.canvas = document.getElementById('canvas');
    this.photo = document.getElementById('photo');
    this.startbutton = document.getElementById('startbutton');
    const self = this;
    navigator.mediaDevices.getUserMedia({video: true, audio: false})
        .then(function(stream) {
          self.video.srcObject = stream;
          self.video.play();
        })
        .catch(function(err) {
          console.log('An error occurred: ' + err);
        });

    this.video.addEventListener('canplay', function(ev) {
      if (!self.streaming) {
        self.height = (
          self.video.videoHeight /
          (self.video.videoWidth/self.width)
        );

        // Firefox currently has a bug where the height can't be read from
        // the video, so we will make assumptions if this happens.

        if (isNaN(self.height)) {
          self.height = self.width / (4/3);
        }

        self.video.setAttribute('width', self.width);
        self.video.setAttribute('height', self.height);
        self.canvas.setAttribute('width', self.width);
        self.canvas.setAttribute('height', self.height);
        self.streaming = true;
      }
    }, false);

    startbutton.addEventListener('click', function(ev) {
      self.takepicture();
      ev.preventDefault();
    }, false);

    this.clearphoto();
  },
  methods: {
    clearphoto: function() {
      const context = this.canvas.getContext('2d');
      context.fillStyle = '#AAA';
      context.fillRect(0, 0, this.canvas.width, this.canvas.height);

      const data = this.canvas.toDataURL('image/png');
      this.photo.setAttribute('src', data);
    },
    takepicture: function() {
      const context = this.canvas.getContext('2d');
      if (this.width && this.height) {
        canvas.width = this.width;
        canvas.height = this.height;
        context.drawImage(this.video, 0, 0, this.width, this.height);

        const data = this.canvas.toDataURL('image/png');
        this.photo.setAttribute('src', data);
      } else {
        clearphoto();
      }
    },
  },
};
</script>

<style scoped>

</style>

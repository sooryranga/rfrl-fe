<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-dialog modal-dialog-centered" role="about">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLongTitle">Profile Picture Editor</h5>
            <button v-on:click="cancel" type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="mb-2 ml-2 custom-file">
              <input type="file" class="custom-file-input" id="customFile" @change="croppie">
              <label class="custom-file-label" for="customFile">Choose file</label>
            </div>
            <vue-croppie
              ref="croppieRef"
              :enableOrientation="true"
              :boundary="{ width: 200, height: 200}"
              :viewport="{ width:200, height:200, 'type':'square' }"
              @result="result"
            />
          </div>
          <div class="modal-footer">
            <button type="button" v-on:click="cancel" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <button v-if="notLoading" type="button" v-on:click="crop" class="btn btn-primary">Save Changes</button>
            <button v-if="!notLoading" class="btn btn-primary" type="button" disabled>
              <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              Loading...
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import {profilePhotoRef} from '@/firestore';
import {mapGetters, mapActions} from 'vuex';

export default {
  name: 'photo-editor',
  computed: {
    ...mapGetters('profile', ['currentProfile']),
  },
  data() {
    return {
      cropped: null,
      notLoading: true,
    };
  },
  methods: {
    ...mapActions('profile', ['updateProfile']),
    croppie(e) {
      const files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        this.$refs.croppieRef.bind({
          url: e.target.result,
        });
      };

      reader.readAsDataURL(files[0]);
    },
    result(output) {
      this.cropped = output;
    },
    crop() {
      // Here we are getting the result via callback function
      // and set the result to this.cropped which is being
      // used to display the result above.
      const options = {
        format: 'png',
        quality: 0.7,
        size: {width: 70, height: 70},
        circle: false,
        type: 'blob',
      };
      this.$refs.croppieRef.result(
          options,
          async (output) => this.save(output),
      );
      this.notLoading = false;
    },
    async save(blob) {
      // Save file to bucket and update src
      if (!blob) return;

      const metadata = {
        contentType: 'image/png',
      };
      const snapshot = await profilePhotoRef
          .child(`${this.currentProfile.id}.png`)
          .put(blob, metadata);

      const photo = await snapshot.ref.getDownloadURL();

      await this.updateProfile({photo});

      this.notLoading = true;

      this.$emit('closeEditor');
    },
    'cancel': function() {
      this.$emit(
          'closeEditor',
      );
    },
  },
  mounted() {
    // Upon mounting of the component, we accessed the .bind({...})
    // function to put an initial image on the canvas.
    if (this.currentProfile.photo) {
      this.$refs.croppieRef.bind({
        url: this.currentProfile.photo,
      });
    }
  },
};
</script>

<style scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: table;
  transition: opacity .3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}
</style>

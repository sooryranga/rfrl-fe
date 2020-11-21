<template>
  <transition name="modal">
    <div class="modal-mask text-left">
      <div class="modal-dialog modal-dialog-centered" role="about">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLongTitle">About Editor</h5>
            <button v-on:click="cancel" type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-2">
                <p>Name</p>
              </div>
              <div class="col">
                <input class="w-100" v-model="name" placeholder="Your Name">
              </div>
            </div>
            <div class="row">
              <div class="col-2">
                <p>About</p>
              </div>
              <div class="col">
                <textarea class="h-100 w-100" v-model="about" placeholder="add about"/>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" v-on:click="cancel" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <button type="button" v-on:click="save" class="btn btn-primary">Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import {mapGetters} from 'vuex';

export default {
  name: 'about-editor',
  data: function() {
    return {
      name: null,
      about: null,
    };
  },
  computed: {
    ...mapGetters('profile', ['currentProfile']),
  },
  methods: {
    'bookTutorRoute': function() {
      return {
        name: 'Calendar',
        params: {userId: this.profile.id},
      };
    },
    'bookTutorButton': function() {
      return this.profile.isTutor &&
      (this.profile.id === this.currentProfile.id);
    },
    'save': function() {
      // Save file to bucket and update src
      const state = {
        name: null,
        about: null,
      };
      if (this.currentProfile.name != this.name) {
        state.name = this.name;
      }
      if (this.currentProfile.about != this.about) {
        state.about = this.about;
      }
      if (state) {
        this.$emit(
            'saveEvent',
            state,
        );
      }
    },
    'cancel': function() {
      this.$emit(
          'cancelEvent',
      );
    },
  },
  mounted: function() {
    this.name = this.currentProfile.name;
    this.about = this.currentProfile.about;
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

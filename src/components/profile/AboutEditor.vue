<template>
  <transition name="modal">
    <div class="modal-mask">
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
                <p>First Name</p>
              </div>
              <div class="col">
                <input class="w-100" v-model="firstName" placeholder="Kevin">
              </div>
            </div>
            <div class="row">
              <div class="col-2">
                <p>Last Name</p>
              </div>
              <div class="col">
                <input class="w-100" v-model="lastName" placeholder="Zhang">
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
            <div class="row">
              <div class="col-2">
                <p>Current Work Title</p>
              </div>
              <div class="col">
                <input type="text" class="w-100" v-model="workTitle" placeholder="add work title"/>
              </div>
            </div>
            <div class="row">
              <div class="col-2">
                <p>Years of Experience</p>
              </div>
              <div class="col">
                <input type="number" v-model="yearsOfExperience"/>
              </div>
            </div>
            <div class="row">
              <div class="col-2">
                <p>LinkedIn Profile</p>
              </div>
              <div class="col">
                <input type="text" class="w-100" v-model="linkedInProfile" placeholder="in/reidhoffman/"/>
              </div>
            </div>
            <div class="row">
              <div class="col-2">
                <p>Github Profile</p>
              </div>
              <div class="col">
                <input type="text" class="w-100" v-model="githubProfile" placeholder="github.com/nat"/>
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
import {mapGetters, mapActions} from 'vuex';

export default {
  name: 'about-editor',
  data: function() {
    return {
      firstName: null,
      lastName: null,
      about: null,
      linkedInProfile: null,
      githubProfile: null,
      yearsOfExperience: null,
      workTitle: null,
    };
  },
  computed: {
    ...mapGetters('profile', ['currentProfile']),
  },
  methods: {
    ...mapActions('profile', ['updateProfile']),
    async save() {
      // Save file to bucket and update src
      const state = {
        firstName: null,
        lastName: null,
        about: null,
        linkedInProfile: null,
        githubProfile: null,
        yearsOfExperience: null,
        workTitle: null,
      };
      Object.keys(state).forEach((key) => {
        if (this.currentProfile[key] != this[key]) {
          state[key] = this[key];
        }
      });

      await this.updateProfile(state);

      this.$emit(
          'closeEditor',
          state,
      );
    },
    'cancel': function() {
      this.$emit(
          'closeEditor',
      );
    },
  },
  mounted: function() {
    this.firstName = this.currentProfile.firstName;
    this.lastName = this.currentProfile.lastName;
    this.about = this.currentProfile.about;
    this.linkedInProfile = this.currentProfile.linkedInProfile;
    this.githubProfile = this.currentProfile.githubProfile;
    this.yearsOfExperience = this.currentProfile.yearsOfExperience;
    this.workTitle = this.currentProfile.workTitle;
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

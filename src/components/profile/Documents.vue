<template>
  <div v-if="profile.documents" id="documents" class="shadow p-3 my-3 bg-white">
    <h3 class="text-left ml-4 my-2"> Documents </h3>
    <div class="card-columns">
      <div v-for="document in profile.documents" v-bind:key="document.name" class="card" style="width: 18rem;">
        <div class="card-body">
          <h5 class="card-title">{{document.name}}</h5>
          <p class="card-subtitle mb-2 text-muted">
            {{document.description}}
          </p>
          <embed v-bind:type="document.type" v-bind:src="document.src" class="documentEmbed">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';
import {DOCUMENTS} from '@/constants.actions.js';

export default {
  name: 'document',
  props: {
    'profileId': String,
  },
  computed: {
    ...mapGetters('profile', ['getProfile']),
    'profile': function() {
      if (this.profileId == this.getProfile.id) {
        return this.getProfile;
      } else {
        return this.getProfile;
      }
    },
    'isLoggedInUser': function() {
      return this.getProfile.id == this.profileId;
    },
  },
  methods: {
    ...mapActions('profile', [DOCUMENTS]),
  },
  mounted: function() {
    if (this.isLoggedInUser) {
      this[DOCUMENTS]();
    }
  },
};
</script>

<style>
.documentEmbed{
  height:12vh;
  width:10vw;
}
</style>

<template>
  <div  id="documents" class="shadow p-3 my-3 bg-white">
    <div class="row">
      <div class="col">
        <h3 class="text-left ml-4 my-2"> Documents </h3>
      </div>
      <div class="col-2 mx-auto my-auto addHover">
        <span class="material-icons md-dark md-36">add</span>
      </div>
    </div>
    <div v-if="profile.documents.length" class="mt-4 card-columns mx-3">
      <div v-for="document in profile.documents" v-bind:key="document.id" class="card">
        <div>
          <embed v-bind:type="document.type" v-bind:src="document.src" class="documentEmbed">
          <div class="card-body text-left py-1 documentBody">
            <h5 class="card-title">{{document.name}}</h5>
            <p class="card-text">{{document.description}}</p>
          </div>
        </div>
        <div class="documentEditor hover-to-show">
          <span class="material-icons md-dark">create</span>
          <span class="material-icons md-dark">drag_handle</span>
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
    ...mapGetters('profile', ['currentProfile']),
    'profile': function() {
      if (this.profileId == this.currentProfile.id) {
        return this.currentProfile;
      } else {
        return this.currentProfile;
      }
    },
    'isLoggedInUser': function() {
      return this.currentProfile.id == this.profileId;
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

<style scoped>
.documentEmbed{
  height:12vh;
  padding:5px;
  width:100%;
}
#documentCard{
  width:30%;
}
.documentBody{
  height:12vh;
  overflow: scroll;
}
.hover-to-show
{
  visibility:hidden;
  opacity:0;
  transition:opacity 0.5s linear;
}

.card:hover>.hover-to-show
{
    display:block;
    visibility:visible;
    opacity:1;
}

/* Rules for sizing the icon. */
.material-icons.md-18 { font-size: 18px; }
.material-icons.md-24 { font-size: 24px; }
.material-icons.md-36 { font-size: 36px; }
.material-icons.md-48 { font-size: 48px; }

/* Rules for using icons as black on a light background. */
.material-icons.md-dark { color: rgba(0, 0, 0, 0.54); }
.material-icons.md-dark.md-inactive { color: rgba(0, 0, 0, 0.26); }

/* Rules for using icons as white on a dark background. */
.material-icons.md-light { color: rgba(255, 255, 255, 1); }
.material-icons.md-light.md-inactive { color: rgba(255, 255, 255, 0.3); }
</style>

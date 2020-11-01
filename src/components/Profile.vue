<template>
  <div class="row">
      <div class="col-7">
        <div id="profileheader" class="shadow p-3 my-5 bg-white">
	  <img class="profilePicture" v-bind:src="currentProfile.profileImage"/>
          <div>
            <h3>{{currentProfile.name}}</h3>
            <h4 class="text-left text-uppercase"> About </h4>
            <p>{{currentProfile.about}}</p>
          </div>
        </div>
      </div>
      <div class="col">
      </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';

export default {
  name: 'tutor',
  computed: mapGetters('profile', ['currentProfile']),
};
</script>

<style>

</style>

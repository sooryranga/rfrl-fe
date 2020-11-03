<template>
  <div class="row">
    <div class="col-7">
      <div id="profileheader" class="shadow p-3 my-5 pb-5 bg-white">
        <img class="profilePicture float-left" v-bind:src="currentProfile.profileImage"/>
        <div>
          <h3 class="test-left">{{currentProfile.name}}</h3>
          <h4 class="text-left text-uppercase"> About </h4>
          <p class="text-left">{{currentProfile.about}}</p>
        </div>
      </div>
      <div id="education" class="shadow p-3 my-5 bg-white">
        <h1 class="text-left"> Education </h1>
        <ul class="text-left list-group list-group-flush">
          <li
            v-for="education in currentProfile.schooling" :key="education" class="list-group-item">
            Vestibulum at eros
          </li>
        </ul>
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
.profilePicture{
  background-size: cover;
  background-position: top center;
  border-radius: 50%;
}
</style>

<template>
  <div id="app">
    <div class="
      align-items-center p-1 px-md-4
      bg-white border-bottom shadow-sm
      text-center
    " id="topnavbar">
      <div class="container-xl" id="navbar2">
        <div class="row my-2">
          <div class="col-4">
            <div class="row">
              <router-link class="p-2 col" to="/">TutorMe</router-link>
            </div>
          </div>
          <div class="col">
            <div class="row">
              <router-link class="col p-2 text-dark" to="/">Home</router-link>
              <router-link class="col p-2 text-dark" to="/questions">Ask Question</router-link>
              <router-link class="col p-2 text-dark" to="/tutors">Find Tutor</router-link>
              <router-link class="col p-2 text-dark" to="/chat">Messages</router-link>
              <div v-if="loggedIn" class="col">
                <div class="dropdown">
                  <button
                  class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton"
                  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <img id="navProfilePicture" v-bind:src="currentProfile.profileImage"/>
                    {{currentProfile.name}}
                  </button>
                  <div class="dropdown-menu dropdown-menu-left" aria-labelledby="dropdownMenuButton">
                    <router-link
                        class="dropdown-item text-dark"
                        :to="profileLink">
                      View Profile
                    </router-link>
                    <a class="dropdown-item" href="#">Settings & Privacy</a>
                    <a class="dropdown-item" href="#">Sign Out</a>
                  </div>
                </div>
              </div>
              <div class="col align-items-center" v-else>
                <router-link class="btn btn-dark mr-2" to="/signup">Sign Up</router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div id="content">
      <router-view :key="$route.fullPath"/>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';

export default {
  name: 'tutor',
  computed: {
    ...mapGetters('authentication', ['loggedIn']),
    ...mapGetters('profile', ['currentProfile']),
    profileLink: function() {
      return {
        name: 'profile',
        params: {userId: this.currentProfile.id},
      };
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
  flex-flow: column;
  height: 100%;
  z-index: 10;
  width: 100vw;
}
p {
  font-size: 14px;
}
#topnavbar{
  height: 65px;
}
#content{
  height: calc(100vh - 66px);
}
html, body {
  height: 100%;
}
.sticky-top{
  z-index:4
}
#navProfilePicture{
  height: 30px;
  width: 30px;
  background-size: cover;
  background-position: top center;
  border-radius: 50%;
}
</style>

<template>
  <div id="app">
    <div class="
      sticky-top navbar navbar-default navbar-fixed-top align-items-center
      justify-content-center p-3 px-md-4 bg-white border-bottom shadow-sm
      w-100 flex-column flex-shrink-1 mb-0" id="topnavbar">
      <div class="d-flex flex-row w-75" id="navbar2">
        <div class="d-flex my-2 my-md-0 mr-md-3 justify-content-start">
          <router-link class="p-2" to="/">TutorMe</router-link>
        </div>
        <nav class="d-flex my-2 my-md-0 mr-md-3 justify-content-end">
            <router-link class="p-2 text-dark" to="/">Home</router-link>
            <router-link class="p-2 text-dark" to="/questions">Ask Question</router-link>
            <router-link class="p-2 text-dark" to="/tutors">Find Tutor</router-link>
            <router-link class="p-2 text-dark mr-3" to="/about">About</router-link>
            <div v-if="loggedIn">
              <div class="dropdown">
                <button
                class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton"
                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <img class="profilePicture" v-bind:src="getProfile.profileImage"/>
                  {{getProfile.name}}
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
            <div class="d-flex align-items-center" v-else>
              <router-link class="btn btn-dark p-2 mr-2" to="/signup">Sign Up</router-link>
            </div>
        </nav>
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
    ...mapGetters('profile', ['getProfile']),
    profileLink: function() {
      return {
        name: 'profile',
        params: {userId: this.getProfile.id},
      };
    },
  },
};
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  flex-flow: column;
  height: 100%;
  z-index: 10;
  width: 100vw;
}
#topnavbar{
  height: 7vh;
}
#navbar2{
  min-width: 400px;
}
#content{
  height:93vh;
}
html, body {
  height: 100%;
}
.sticky-top{
  z-index:4
}
.profilePicture{
  height: 3vh;
  width: 3vh;
  background-size: cover;
  background-position: top center;
  border-radius: 50%;
}
</style>

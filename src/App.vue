<template>
  <div id="app" class="d-flex flex-column h-100 w-100">
    <div class="
      sticky-top navbar navbar-default navbar-fixed-top align-items-center
      justify-content-center p-3 px-md-4 bg-white border-bottom shadow-sm
      w-100 flex-column flex-shrink-1 mb-0" id="topnavbar">
      <div class="d-flex flex-row w-100">
        <div class="d-flex my-2 my-md-0 mr-md-3 justify-content-start">
          <router-link class="p-2" to="/">TutorMe</router-link>
        </div>
        <nav class="d-flex my-2 my-md-0 mr-md-3 justify-content-end">
          <router-link class="p-2 text-dark" to="/questions">Ask Question</router-link>
          <router-link class="p-2 text-dark" to="/tutors">Find Tutor</router-link>
          <router-link class="p-2 text-dark mr-3" to="/about">About</router-link>
          <div v-if="currentUser">
              <router-link class="p-2 text-dark" to="/"> {{currentUser.name}}</router-link>
          </div>
          <div class="d-flex align-items-center" v-else>
              <router-link class="btn btn-dark p-2 mr-2" to="/signup">Sign Up</router-link>
              <router-link class="btn btn-dark p-2" to="/login">Login</router-link>
          </div>
        </nav>
      </div>
    </div>
    <div class="d-flex flex-column flex-grow-1">
      <router-view/>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';

export default {
  name: 'tutor',
  computed: mapGetters(['currentUser']),
};
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  min-height: 100vh;
  min-width: 100vw;
  flex-flow: column;
}
#topnavbar{
  max-height: 8vh;
}
html, body {
    height: 100%;
}
.sticky-top{
  z-index:4
}
</style>

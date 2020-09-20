<template>
  <div id="app" class="container h-100 w-100">
    <div class="sticky-top row navbar navbar-default navbar-fixed-top align-items-center justify-content-center p-3 px-md-4 mb-3 bg-white border-bottom shadow-sm">
      <div class="col-sm">
        <router-link class="p-2" to="/">TutorMe</router-link>
      </div>
      <nav class="col-sm row my-2 my-md-0 mr-md-3 justify-content-end">
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
    <div class="row row-cols-1 h-75 align-middle">
      <router-view class="col"/>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'tutor',
  computed: mapGetters(['currentUser'])
}
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  min-height: 100%;
}
html, body {
    height: 100%;
}
.sticky-top{
  z-index:4
}
</style>

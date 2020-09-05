<template>
  <div id="app">
    <div id="topbar">
      <div class="nav left">
        <router-link to="/">Home</router-link> |
        <router-link to="/ask-question">Ask Question</router-link> |
        <router-link to="find-tutor">Find Tutor</router-link> |
        <router-link to="about">About</router-link>
      </div>
      <div class="nav right">
        <div v-if="user">
            <router-link to="/"></router-link> |
        </div>
        <div v-else>
            <tab>Sign Up</tab>
            <tab>
        </div>
      </div>
    </div>
    <router-view/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'HelloWorld',
  computed: {
    ...mapGetters([
      'getUser'
    ])
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>

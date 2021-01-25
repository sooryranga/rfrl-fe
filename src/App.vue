<template>
  <v-app id="app">
    <v-app-bar
      app
      elevation=4
      height=50>
      <v-container>
        <v-row no-gutters>
          <v-col class="my-auto col-auto">
            <v-app-bar-title class="mx-auto" style="cursor: pointer" v-on:click="$router.push('/')">
              {{appTitle}}
            </v-app-bar-title>
          </v-col>
          <v-spacer></v-spacer>
          <v-col class="col-auto mr-3">
            <v-tabs optional center-active id="app-toolbar-tabs">
              <v-tabs-slider color="primary"></v-tabs-slider>
              <v-tab to="/">Home</v-tab>
              <v-tab to="/questions">Ask Question</v-tab>
              <v-tab to="/tutors">Find Tutor</v-tab>
              <v-tab to="/chat">Messages</v-tab>
            </v-tabs>
          </v-col>
          <v-col class="col-auto my-auto mx-auto">
            <div class="text-center" v-if="loggedIn">
              <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="grey darken-3"
                    dark
                    v-bind="attrs"
                    v-on="on"
                  >
                      <v-avatar
                        size=30
                        class="mr-3"
                      >
                        <img
                          v-bind:src="currentProfile.profileImage"/>
                      </v-avatar>
                    {{currentProfile.name}}
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item
                    :key="index"
                    :to="profileLink"
                  >
                    <v-list-item-title>View Profile</v-list-item-title>
                  </v-list-item>
                  <v-list-item
                    :key="index"
                    :to="profileLink"
                  >
                    <v-list-item-title>Settings</v-list-item-title>
                  </v-list-item>
                  <v-list-item
                    :key="index"
                    :to="profileLink"
                  >
                    <v-list-item-title>Sign Out</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
            <div v-else>
              <v-btn
                color="secondary"
                elevation="3"
                to="/signup"
              >
                Sign Up
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>
    <!-- Sizes your content based upon application components -->
    <v-main>

      <!-- Provides the application the proper gutter -->
      <v-container fluid class="p-0" id="content">

        <!-- If using vue-router -->
        <router-view :key="$route.fullPath"></router-view>
      </v-container>
    </v-main>
  </v-app>
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
  data: function() {
    return {
      appTitle: 'TutorMe',
    };
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif !important;
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
#content{
  height: calc(100vh - 40px);
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
#app-toolbar-tabs .v-tabs-bar{
  background-color: transparent;
}
</style>

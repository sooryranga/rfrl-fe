<template>
  <div class="d-flex flex-row">
    <div id="left-bar" class="d-flex flex-column">
      <video-messaging></video-messaging>
      <instant-messaging class="d-flex flex-grow-1 overflow-auto"></instant-messaging>
    </div>
    <div id="right" class="d-flex flex-column">
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item active">
              <router-link
                class="nav-link"
                :to="{ name: 'code', params: {userId: $route.params.userId }}">
                Code
              </router-link>
            </li>
            <li class="nav-item">
              <router-link
                class="nav-link"
                :to="{ name: 'code', params: {userId: $route.params.userId }}">
                Code
              </router-link>
            </li>
            <li class="nav-item">
              <router-link
                class="nav-link"
                :to="{ name: 'code', params: {userId: $route.params.userId }}">
                Code
              </router-link>
            </li>
          </ul>
        </div>
      </nav>
      <router-view class="flex-grow-1"/>
    </div>
  </div>
</template>

<script>
export default {
  data: function() {
    return {};
  },
  mounted: function() {
    console.log(this.$route.fullPath);
  },
};
</script>

<style>
#left-bar{
  position:relative;
  width:21vw;
  min-width: 300px;
  flex: 0 1 auto!important;;
}

</style>

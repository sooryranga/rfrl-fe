<template>
  <div id="left-bar" class="d-flex flex-column">
    <video-messaging></video-messaging>
    <instant-messaging class="d-flex flex-grow-1 overflow-auto"></instant-messaging>
  </div>
</template>

<script>
export default {
  data: function() {
    return {};
  },
};
</script>

<style>
#left-bar{
  position:relative;
  width:20vw;
  min-width: 300px;
}

</style>

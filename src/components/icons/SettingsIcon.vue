<template>
  <!-- eslint-disable vue/max-len -->
  <svg xmlns="http://www.w3.org/2000/svg"
    :width="size"
    :height="size"
    viewBox="0 0 256 256"
    :aria-labelledby="iconName"
    role="presentation"
    id="icon"
    ref="icon"
  >
    <title
      :id="iconName"
      lang="en"
    >{{ iconName }} icon</title>
    <g>
      <rect width="256" height="256" fill="none"/>
      <circle :stroke="iconColor" fill="none" cx="128" cy="128" r="96" opacity="0.2"/>
      <circle class="icon-stroke" :stroke="iconColor" cx="128" cy="128" r="96" fill="none" stroke-miterlimit="10"/>
      <circle class="icon-fill" :fill="iconColor" cx="176" cy="128" r="12"/>
      <circle class="icon-fill" :fill="iconColor" cx="128" cy="128" r="12"/>
      <circle class="icon-fill" :fill="iconColor" cx="80" cy="128" r="12"/>
    </g>
  </svg>
  <!-- eslint-enable -->
</template>

<script>
import IconBaseMixinVue from './IconBaseMixin.vue';
export default {
  name: 'settings-icon',
  data() {
    return {
      iconName: 'settings-icon',
    };
  },
  mixins: [IconBaseMixinVue],
};
</script>

<style scoped src="@/css/icons.css">
</style>

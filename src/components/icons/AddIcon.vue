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
    :class="iconClass"
  >
    <title
      :id="iconName"
      lang="en"
    >{{ iconName }} icon</title>
    <g>
      <rect width="256" height="256" fill="none"/>
      <circle class="icon-stroke" :stroke="iconColor" cx="128" cy="128" r="96" opacity="0"/>
      <circle class="icon-stroke" :stroke="iconColor" cx="128" cy="128" r="96" fill="none" stroke-miterlimit="10"/>
      <line class="icon-stroke" :stroke="iconColor" x1="70" y1="128" x2="180" y2="128" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <line class="icon-stroke" :stroke="iconColor" x1="128" y1="70" x2="128" y2="180" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    </g>
  </svg>
  <!-- eslint-enable -->
</template>

<script>
import IconBaseMixinVue from './IconBaseMixin.vue';
export default {
  name: 'add-icon',
  data() {
    return {
      iconName: 'add-icon',
    };
  },
  mixins: [IconBaseMixinVue],
};
</script>

<style scoped src="@/css/icons.css">
</style>

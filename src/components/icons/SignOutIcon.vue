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
      <polyline class="icon-stroke" :stroke="iconColor" points="174.011 86 216 128 174.011 170" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <line class="icon-stroke" :stroke="iconColor" x1="104" y1="128" x2="215.97057" y2="128" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <path class="icon-stroke" :stroke="iconColor" d="M104,216H48a8,8,0,0,1-8-8V48a8,8,0,0,1,8-8h56" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    </g>
  </svg>
  <!-- eslint-enable -->
</template>

<script>
import IconBaseMixinVue from './IconBaseMixin.vue';
export default {
  name: 'sign-out-icon',
  data() {
    return {
      iconName: 'sign-out-icon',
    };
  },
  mixins: [IconBaseMixinVue],
};
</script>

<style scoped src="@/css/icons.css">
</style>

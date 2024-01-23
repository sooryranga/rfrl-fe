<template>
  <!-- eslint-disable vue/max-len -->
  <svg xmlns="http://www.w3.org/2000/svg"
    :width="size"
    :height="size"
    viewBox="0 0 256.00098 256.00098"
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
      <path class="icon-stroke" :stroke="iconColor"  d="M77.98509,201.34409,45.14832,228.94793a8,8,0,0,1-13.14783-6.12372V64.00049a8,8,0,0,1,8-8h176a8,8,0,0,1,8,8v128a8,8,0,0,1-8,8H81.67142Z" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <line class="icon-stroke" :stroke="iconColor"  x1="96.00049" y1="112" x2="160.00049" y2="112" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <line class="icon-stroke" :stroke="iconColor" x1="96.00049" y1="144" x2="160.00049" y2="144" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    </g>
  </svg>
  <!-- eslint-enable -->
</template>

<script>
import IconBaseMixinVue from './IconBaseMixin.vue';
export default {
  name: 'message-icon',
  data() {
    return {
      iconName: 'message-icon',
    };
  },
  mixins: [IconBaseMixinVue],
};
</script>

<style scoped src="@/css/icons.css">
</style>

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
      <rect class="icon-stroke" :stroke="iconColor" x="40" y="40" width="176" height="176" rx="8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      <line class="icon-stroke" :stroke="iconColor" x1="120" y1="112.00094" x2="120" y2="176.00094" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <line class="icon-stroke" :stroke="iconColor" x1="88" y1="112.00094" x2="88" y2="176.00094" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <path class="icon-stroke" :stroke="iconColor" d="M120,140.00094a28,28,0,1,1,56,0v36" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <circle class="icon-stroke" :stroke="iconColor" :fill="iconColor" cx="88" cy="79.99998" r="12"/>
    </g>
  </svg>
  <!-- eslint-enable -->
</template>

<script>
import IconBaseMixinVue from './IconBaseMixin.vue';
export default {
  name: 'work-icon',
  data() {
    return {
      iconName: 'work-icon',
    };
  },
  mixins: [IconBaseMixinVue],
};
</script>

<style scoped src="@/css/icons.css">
</style>

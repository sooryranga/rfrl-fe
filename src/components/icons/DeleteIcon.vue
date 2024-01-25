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
      <line class="icon-stroke" :stroke="iconColor" x1="215.99609" y1="56" x2="39.99609" y2="56.00005" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <line class="icon-stroke" :stroke="iconColor" x1="104" y1="104" x2="104" y2="168" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <line class="icon-stroke" :stroke="iconColor" x1="152" y1="104" x2="152" y2="168" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <path class="icon-stroke" :stroke="iconColor" d="M200,56V208a8,8,0,0,1-8,8H64a8,8,0,0,1-8-8V56" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <path class="icon-stroke" :stroke="iconColor" d="M168,56V40a16,16,0,0,0-16-16H104A16,16,0,0,0,88,40V56" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    </g>
  </svg>
  <!-- eslint-enable -->
</template>

<script>
import IconBaseMixinVue from './IconBaseMixin.vue';
export default {
  name: 'delete-icon',
  data() {
    return {
      iconName: 'delete-icon',
    };
  },
  mixins: [IconBaseMixinVue],
};
</script>

<style scoped src="@/css/icons.css">
</style>

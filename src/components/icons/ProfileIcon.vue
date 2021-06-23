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
      <circle class="icon-stroke" :stroke="iconColor" cx="128" cy="128" r="96" fill="none"  stroke-miterlimit="10" />
      <circle class="icon-stroke" :stroke="iconColor" cx="128" cy="120" r="40" fill="none" stroke-miterlimit="10"/>
      <path class="icon-stroke" :stroke="iconColor" d="M63.79905,199.37405a72.02812,72.02812,0,0,1,128.40177-.00026" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    </g>
  </svg>
  <!-- eslint-enable -->
</template>

<script>
import IconBaseMixinVue from './IconBaseMixin.vue';
export default {
  name: 'profile-icon',
  data() {
    return {
      iconName: 'profile-icon',
    };
  },
  mixins: [IconBaseMixinVue],
};
</script>

<style scoped src="@/css/icons.css">
</style>

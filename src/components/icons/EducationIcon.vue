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
      <polygon :stroke="iconColor" points="8 96 128 32 248 96 128 160 8 96" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="8"/>
      <polyline :stroke="iconColor" points="188 240 188 128 128 96" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="8"/>
      <path :stroke="iconColor" d="M220,110.93333v54.5208a7.95694,7.95694,0,0,1-1.58951,4.78692C211.67382,179.20536,183.2529,212,128,212s-83.67382-32.79464-90.41049-41.75895A7.95694,7.95694,0,0,1,36,165.45413v-54.5208" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="8"/>
    </g>
  </svg>
  <!-- eslint-enable -->
</template>

<script>
import IconBaseMixinVue from './IconBaseMixin.vue';
export default {
  name: 'edit-icon',
  data() {
    return {
      iconName: 'edit-icon',
    };
  },
  mixins: [IconBaseMixinVue],
};
</script>

<style scoped src="@/css/icons.css">
</style>

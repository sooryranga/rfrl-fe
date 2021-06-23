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
      <path class="icon-stroke" :stroke="iconColor" d="M34.0714,140.74858a71.96979,71.96979,0,1,1,25.18031,25.1802l.00017-.00075-24.86742,7.105a6,6,0,0,1-7.41747-7.41747l7.105-24.86742Z" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <path class="icon-stroke" :stroke="iconColor" d="M92.059,175.89247a72.04349,72.04349,0,0,0,104.68926,38.03631l-.00017-.00075,24.86742,7.105a6,6,0,0,0,7.41747-7.41747l-7.105-24.86742.00057.00046A72.01951,72.01951,0,0,0,163.93781,80.10585" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    </g>
  </svg>
  <!-- eslint-enable -->
</template>

<script>
import IconBaseMixinVue from './IconBaseMixin.vue';
export default {
  name: 'chat-icon',
  data() {
    return {
      iconName: 'chat-icon',
    };
  },
  mixins: [IconBaseMixinVue],
};
</script>

<style scoped src="@/css/icons.css">
</style>

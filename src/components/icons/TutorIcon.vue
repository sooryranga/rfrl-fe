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
      <circle class="icon-stroke" :stroke="iconColor" cx="104" cy="144" r="32" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <path class="icon-stroke" :stroke="iconColor" d="M53.38964,207.99876a56.02294,56.02294,0,0,1,101.22072,0L215.99984,208A8,8,0,0,0,224,200V56a8,8,0,0,0-8-8H40a8,8,0,0,0-8,8V200.00074A7.99926,7.99926,0,0,0,40,208Z" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <polyline class="icon-stroke" :stroke="iconColor" points="176 176 192 176 192 80 64 80 64 96" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    </g>
  </svg>
  <!-- eslint-enable -->
</template>

<script>
import IconBaseMixinVue from './IconBaseMixin.vue';
export default {
  name: 'tutor-icon',
  data() {
    return {
      iconName: 'tutor-icon',
    };
  },
  mixins: [IconBaseMixinVue],
};
</script>

<style scoped src="@/css/icons.css">
</style>

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
      <circle class="icon-stroke" :stroke="iconColor" cx="128" cy="128" r="96" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <circle class="icon-stroke icon-fill" :stroke="iconColor" cx="128" cy="180" r="12" :fill="iconColor"/>
      <path class="icon-stroke" :stroke="iconColor" d="M127.9995,144.0045v-8a28,28,0,1,0-28-28" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    </g>
  </svg>
  <!-- eslint-enable -->
</template>

<script>
import IconBaseMixinVue from './IconBaseMixin.vue';
export default {
  name: 'question-icon',
  data() {
    return {
      iconName: 'question-icon',
    };
  },
  mixins: [IconBaseMixinVue],
};
</script>

<style scoped src="@/css/icons.css">
</style>

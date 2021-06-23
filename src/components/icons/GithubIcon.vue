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
      <path class="icon-stroke" :stroke="iconColor" d="M84,232a24,24,0,0,0,24-24V160" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <path class="icon-stroke" :stroke="iconColor" d="M172,232a24,24,0,0,1-24-24V160" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <path class="icon-stroke" :stroke="iconColor" d="M152,160h16a24,24,0,0,1,24,24v8a24,24,0,0,0,24,24" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <path class="icon-stroke" :stroke="iconColor" d="M104,160H88a24,24,0,0,0-24,24v8a24,24,0,0,1-24,24" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <path class="icon-stroke" :stroke="iconColor" d="M64.51166,76.70377A51.90056,51.90056,0,0,1,68,32a51.9599,51.9599,0,0,1,43.82469,23.9988V56h32.35061V55.9988A51.9599,51.9599,0,0,1,188,32a51.90056,51.90056,0,0,1,3.48834,44.70377l0,0A47.77872,47.77872,0,0,1,200,104v8a48,48,0,0,1-48,48H104a48,48,0,0,1-48-48v-8a47.77872,47.77872,0,0,1,8.51163-27.29627Z" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
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

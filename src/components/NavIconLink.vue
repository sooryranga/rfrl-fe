<template>
  <a
    :href="href"
    @click="navigate"
    @mouseleave="hover = false"
    @mouseover="hover = true">
    <slot></slot>
  </a>
</template>

<script>
export default {
  name: 'nav-icon-link',
  props: {
    active: {
      type: Boolean,
      default: false,
      required: false,
    },
    href: {
      type: String,
      required: true,
    },
    navigate: {
      type: Function,
      required: true,
    },
  },
  computed: {
    activated() {
      return this.active || this.hover;
    },
  },
  data() {
    return {
      hover: false,
    };
  },
};
</script>

<style scoped>
</style>

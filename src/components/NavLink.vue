<template>
  <a
    :href="href"
    @click="navigate"
    class="nav-item h-100"
    @mouseleave="hover = false"
    @mouseover="hover = true">
    <div class="link-container">
      <div class="name"><slot></slot></div>
      <transition name="slide-fade">
        <div v-if="show" class="line"/>
      </transition>
    </div>
  </a>
</template>

<script>
export default {
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
    show() {
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
.nav-item {
  vertical-align: middle;
}

.link-container {
  height: 100%
}

.name {
  position: relative;
  top: calc(50% - 0.7rem);
}

a {
  font-size: 1em;
  font-weight: 600;
  color: white;
  letter-spacing: 1px;
  text-decoration: none;
}

.line {
  height: 2px;
  width: 100%;
  position: relative;
  top: 0.8rem;
  background-color: white;
  margin-top:0.2rem;
}


.slide-fade-enter-active {
  transition: all .3s cubic-bezier(0.22, 0.61, 0.36, 1);
}
.slide-fade-leave-active {
  transition: all .3s cubic-bezier(0.22, 0.61, 0.36, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
</style>

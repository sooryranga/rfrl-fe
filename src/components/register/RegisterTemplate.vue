<template>
  <div class="row h-100 w-100 p-0 m-0">
    <loading :active.sync="isLoading"/>
    <div class="col h-100 p-0">
      <img v-bind:src="imageSrc" id="feature-img"/>
    </div>
    <div class="col h-100 p-0" style="position: relative;">
      <transition name="fade">
        <div v-if="showError" class="alert alert-danger fade-in fixed-current-top" role="alert">
          {{error}}
        </div>
      </transition>
      <div id="parent">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isLoading: {
      type: Boolean,
      required: true,
    },
    showError: {
      type: Boolean,
      required: true,
    },
    error: {
      type: String,
      required: false,
      default: '',
    },
    imageSrc: {
      type: String,
      required: true,
    },
  },
};
</script>

<style>
#parent{
  display: flex;
  justify-content: space-around;
  height: 100%;
  flex-direction:column;
  align-items: center;
  padding-top: 5rem;
  padding-bottom: 5rem;
}

#feature-img{
  height: 100%;
  width: 100%;
  object-fit: cover;
}

.fixed-current-top {
  position: absolute;
  top: 1rem;
  width: calc(100% - 2rem);
  margin-left: 1rem;
  margin-right: 1rem;
  z-index: 123;
}

</style>

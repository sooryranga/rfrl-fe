<template>
  <div class="card">
    <img class="profile-img" v-bind:src="img"/>
    <div class="card-body">
      <slot></slot>
    </div>
    <router-link class="text-decoration-none" :to="routeTo">
      <button class="card-button">Profile</button>
    </router-link>
  </div>
</template>

<script>
export default {
  props: {
    img: {
      requied: true,
      type: String,
    },
    routeTo: {
      required: true,
      type: Object,
    },
  },
};
</script>

<style scoped>
.card {
  box-shadow: 0px 2px 8px 0px var(--clr-gray-light);
  background-color: white;
  border-radius: 1rem;
  position: relative;
  margin: 0.5rem;
  margin-top: 3.5rem;
}

.profile-img {
  width: 8rem;
  clip-path: circle(60px at center);
  margin-top: -3rem;
  margin-left: 1rem;
}

.card-body {
  font-size: 0.9rem;
  margin-left: 1rem;
}

.card-button {
  width: 100%;
  border: none;
  font-size: 1rem;
  font-weight: 600;
  color: white;
  padding: 1rem;
  background-color: var(--clr-primary-light);
  border-bottom-left-radius: 1rem;
  border-bottom-right-radius: 1rem;
}

.card-button:hover {
  background-color: var(--clr-primary);
}
</style>

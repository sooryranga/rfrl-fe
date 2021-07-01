<template>
  <div class="card">
    <div class="profile-img-container">
      <img class="profile-img" v-bind:src="img"/>
    </div>
    <div class="card-body">
      <slot></slot>
    </div>
    <div class="card-buttons">
      <router-link class="text-decoration-none" :to="routeToProfile">
        <profile-icon class="card-button"/>
      </router-link>
      <button class="no-styling-button" v-on:click="startChatting">
        <chat-icon class="card-button"/>
      </button>
    </div>
  </div>
</template>

<script>
import {ProfileIcon, ChatIcon} from '@/components/icons/';

export default {
  components: {
    ProfileIcon,
    ChatIcon,
  },
  props: {
    img: {
      requied: true,
      type: String,
    },
    routeToProfile: {
      required: true,
      type: Object,
    },
  },
  methods: {
    startChatting() {
      this.$emit('startChatting');
    },
  },
};
</script>

<style scoped>
.card {
  --card-bg-clr: white;
  --card-shdw-clr: var(--clr-gray-7);
  --card-button-clr: var(--clr-gray-9);
  --card-button-bg-clr: var(--clr-primary-light);
  --card-button-bg-hover-clr: var(--clr-accent);

  box-shadow: 0px 2px 8px 0px var(--card-shdw-clr);
  background-color: var(--card-bg-clr);
  border-radius: 1.1rem;
  flex-direction: row;
  display:flex;
  height: 9rem;
  margin-bottom: 1rem;
  flex-wrap: nowrap;
}

.profile-img {
  width: 5rem;
  height: 5rem;
  background-size: cover;
  background-position: top center;
  border-radius: 50%;
  border: 3px solid white;
}

.profile-img-container {
  width: 7.5rem;
  background-color: var(--clr-primary);
  border-bottom-left-radius: 1rem;
  border-top-left-radius: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.card-buttons{
  flex-direction: column;
  display:flex;
  height:100%;
  width:5rem;
  flex-wrap: nowrap;
  justify-content:space-around;
  align-items: center;
  padding-left: 1rem;
  padding-right: 1rem;
  font-size:2.5rem;
}

.card-body {
  font-size: 0.9rem;
  flex: 1 1;
}

.card-button{
  height:100%;
}
</style>

<template>
  <div class="wrapper-grid">
    <div v-for="(client) in clients" v-bind:key="client.id" class="card">
      <img v-bind:src="getClientPhoto(client)" class="profile-img">
      <p class="name">{{name(client.firstName, client.lastName)}}</p>
      <div v-if="client.about">
        <p class="about">{{shortAbout(client.about)}}</p>
      </div>
      <router-link class="stretched-link text-decoration-none" :to="routeToClient(client.id)">
        <button class='btn'>Profile</button>
      </router-link>
    </div>
    <infinite-loading @infinite="infiniteHandler">
      <div slot="no-more">
        <div class="card">
          <h6 class="my-2 text-muted">No more clients</h6>
        </div>
      </div>
      <div slot="no-results">
        <div class="card">
          <h6 class="my-2 text-muted">No more clients</h6>
        </div>
      </div>
    </infinite-loading>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';
import InfiniteLoading from 'vue-infinite-loading';

export default {
  name: 'ClientSelector',
  components: {
    InfiniteLoading,
  },
  computed: {
    ...mapGetters('listClients', ['clients']),
    ...mapGetters('profile', ['currentProfile']),
  },
  methods: {
    ...mapActions('listClients', ['getClients']),
    getClientPhoto(client) {
      return client.photo || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQB8oKGDdE1XOkEAYG_Xmo3HObzakQbY4oHnQ&usqp=CAU'; //eslint-disable-line
    },
    async infiniteHandler($state) {
      const companyId = this.currentProfile.companyId;
      const newClients = await this.getClients(
          {wantingReferralCompanyId: companyId ? [companyId]: []},
      );

      if (newClients.length) {
        $state.loaded();
      } else {
        $state.complete();
      }
    },
    name(firstName, lastName) {
      const name = [];
      if (firstName) {
        name.push(firstName);
      }
      if (lastName) {
        name.push(lastName[0]);
      }
      return name.length > 0 ? name.join(' '): 'test';
    },
    shortAbout(about) {
      const i = about?.indexOf(' ', 60);

      if (!about) {
        return '';
      } else if (i > 60) {
        return about.slice(0, i) + ' ...';
      } else {
        return about;
      }
    },
    routeToClient(id) {
      return {
        name: 'profile',
        params: {
          userId: id,
        },
      };
    },
  },
};
</script>


<style scoped>
.profile-img {
  width: 8rem;
  clip-path: circle(60px at center);
  margin-top: 2rem;
}

.clientProfile{
  min-height: 20vh;
}
.wrapper-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, 20rem);
}
.name {
  font-weight: bold;
  font-size: 1.5rem;
  margin-left: 1rem;
}
.about {
  font-size: 0.9rem;
  margin-left: 1rem;
}
.btn {
  width: 100%;
  border: none;
  font-size: 1rem;
  font-weight: bold;
  color: white;
  padding: 1rem;
  background-color: var(--clr-primary);
}
.banner-img {
  position: absolute;
  background-image: url(https://images.unsplash.com/photo-1582727657635-c771002bdada?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ);
  height: 10rem;
  width: 100%;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

.card {
  overflow: hidden;
  box-shadow: 0px 2px 8px 0px var(--clr-gray-light);
  background-color: white;
  border-radius: 1rem;
  position: relative;
  margin: 0.5rem;
}
</style>

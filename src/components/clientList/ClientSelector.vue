<template>
<div class="h-100">
  <div class="row">
    <div class="col">
      <h4 class="ml-4 my-2"> Clients </h4>
    </div>
  </div>
  <div class="row clientCardsMain mb-2">
    <div class="col mt-4 card-columns mx-3">
      <div v-for="(client) in clients" v-bind:key="client.id" class="card">
        <router-link class="stretched-link text-decoration-none clientProfile" :to="routeToClient(client.id)">
          <img v-bind:src="client.photo"  class="card-img-top clientPhoto">
          <div class="card-body  py-1 documentBody">
            <h6 class="card-title">{{name(client.firstName, client.lastName)}}</h6>
            <div class="card-text">
              <div v-if="client.about" class="row">
                <p class="col">{{shortAbout(client.about)}}</p>
              </div>
            </div>
          </div>
        </router-link>
      </div>
      <infinite-loading @infinite="infiniteHandler">
        <div slot="no-more">
          <div class="card">
            <div class="card-body">
              <h6 class="card-subtitle mb-2 text-muted">No more clients</h6>
            </div>
          </div>
        </div>
        <div slot="no-results">
          <div class="card">
            <div class="card-body">
              <h6 class="card-subtitle mb-2 text-muted">No more clients</h6>
            </div>
          </div>
        </div>
      </infinite-loading>
    </div>
  </div>
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
.clientPhoto{
  height:10vh;
  padding:5px;
  width:100%;
}
.clientProfile{
  min-height: 20vh;
}
.clientCardsMain{
  overflow-y: scroll;
  max-height: 100%;
}
.card-columns {
  column-count: 4;
}
</style>

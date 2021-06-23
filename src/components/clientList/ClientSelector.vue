<template>
  <div class="wrapper-grid">
    <div v-for="(client) in clients" v-bind:key="client.id">
      <profile-card
          :img="getPhoto(client)"
          :routeTo="routeToProfile(client.id)"
        >
        <p class="name">{{name(client.firstName, client.lastName)}}</p>
        <div class="external-profiles">
          <p><a v-if="client.linkedInProfile" :href="toLinkedIn(client.linkedInProfile)">
            <i class="fab fa-linkedin"></i> {{client.linkedInProfile}}
          </a></p>
          <p><a v-if="client.githubProfile" :href="toGithub(client.githubProfile)">
            <i class="fab fa-github"></i> {{client.githubProfile}}
          </a></p>
        </div>
      </profile-card>
    </div>
    <infinite-loading @infinite="infiniteHandler">
      <div slot="no-more">
        <div :style="{marginTop:'4rem'}">
          <h6 class="my-2 text-muted">No more clients</h6>
        </div>
      </div>
      <div slot="no-results">
        <div :style="{marginTop:'4rem'}">
          <h6 class="my-2 text-muted">No more clients</h6>
        </div>
      </div>
    </infinite-loading>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';
import InfiniteLoading from 'vue-infinite-loading';
import ProfileCard from '@/components/ProfileCard';

export default {
  name: 'ClientSelector',
  components: {
    InfiniteLoading,
    ProfileCard,
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
    getPhoto(client) {
      return client.photo || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQB8oKGDdE1XOkEAYG_Xmo3HObzakQbY4oHnQ&usqp=CAU'; //eslint-disable-line
    },
    toLinkedIn(shortenedLinkedIn) {
      return 'https://www.linkedin.com/' + shortenedLinkedIn;
    },
    toGithub(shortenedGithub) {
      return 'https://' + shortenedGithub;
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
    routeToProfile(id) {
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
.wrapper-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, 30rem);
  justify-content: space-between;
}

.external-profiles{
  margin-top: 0.5rem;
  font-size: 0.8rem;
  line-height: 1.6;
}

.name {
  font-weight: bold;
  font-size: 1.5rem;
  color: var(--clr-gray-2)
}

p {
  margin-bottom: 0;
}
</style>

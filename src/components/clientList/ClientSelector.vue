<template>
  <div class="wrapper-grid">
    <div v-for="(client) in clients" v-bind:key="client.id">
      <profile-card
          :img="getPhoto(client)"
          :routeTo="routeToProfile(client.id)"
        >
        <p class="name">{{name(client.firstName, client.lastName)}}</p>
        <div class="profile-items">
          <p v-if="client.linkedInProfile" class="profile-item">
            <linked-in-icon :hoverExpand="false" :iconColor="iconColor"/>
            <a :href="toLinkedIn(client.linkedInProfile)">{{client.linkedInProfile}}</a>
          </p>
          <p v-if="client.githubProfile" class="profile-item">
            <github-icon :hoverExpand="false" :iconColor="iconColor"/>
            <a :href="toGithub(client.githubProfile)">
              {{client.githubProfile}}
            </a>
          </p>
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
import {LinkedInIcon, GithubIcon} from '@/components/icons';
import {mapGetters, mapActions} from 'vuex';
import InfiniteLoading from 'vue-infinite-loading';
import ProfileCard from '@/components/ProfileCard';

export default {
  name: 'ClientSelector',
  components: {
    InfiniteLoading,
    ProfileCard,
    LinkedInIcon,
    GithubIcon,
  },
  data() {
    return {
      iconColor: 'var(--clr-gray-3)',
    };
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
  justify-content: space-around;
}

.profile-items{
  margin-top: 0.5rem;
  font-size: 0.8rem;
  line-height: 1.6;
}

.profile-item{
  margin-top:10px;
}

.profile-item a {
  color: var(--clr-gray-4);
}
.profile-item a:hover {
  color: var(--clr-gray-2);
}

.name {
  font-weight: 300;
  font-size: 1.5rem;
  color: var(--clr-gray-2)
}

.profile-item #icon{
  font-size:1.2rem;
  margin-right:8px;
}

p {
  margin-bottom: 0;
}
</style>

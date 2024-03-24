<template>
  <div>
    <chat-introduction-modal
      v-if="showModal"
      @cancel="cancel"
      :clientId="chatClientId"/>
    <div class="wrapper-grid">
      <div v-for="(client) in activeClients" v-bind:key="client.id">
        <profile-card
            :img="getPhoto(client)"
            :routeToProfile="routeToProfile(client.id)"
            @startChatting="startChatting(client)"
          >
          <p class="name">{{cardName(client.firstName, client.lastName)}}</p>
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
  </div>
</template>

<script>
import ChatIntroductionModal from '@/components/ChatIntroductionModal.vue';
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
    ChatIntroductionModal,
  },
  data() {
    return {
      iconColor: 'var(--clr-gray-3)',
      chatClientId: null,
      showModal: false,
    };
  },
  computed: {
    ...mapGetters('listClients', ['clients']),
    ...mapGetters('profile', ['currentProfile']),
    activeClients() {
      return this.clients.filter((client) => client.firstName);
    },
  },
  methods: {
    ...mapActions('listClients', ['getClients']),
    getClientPhoto(client) {
      return client.photo;
    },
    startChatting(client) {
      this.chatClientId = client.id;
      this.showModal = true;
    },
    cancel() {
      this.showModal = false;
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
      return client.photo;
    },
    toLinkedIn(shortenedLinkedIn) {
      return 'https://www.linkedin.com/' + shortenedLinkedIn;
    },
    toGithub(shortenedGithub) {
      return 'https://' + shortenedGithub;
    },
    cardName(firstName, lastName) {
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

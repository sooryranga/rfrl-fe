<template>
<div class="flex-container-column h-100">
  <div class="scrollable flex-item-grow pb-2">
    <chat-introduction-modal
      v-if="showModal"
      @cancel="cancel"
      :clientId="chatClientId"/>
    <div class="wrapper-grid">
      <div v-for="(tutor) in tutors" v-bind:key="tutor.id">
        <profile-card
          :img="getPhoto(tutor)"
          :routeToProfile="routeToProfile(tutor.id)"
          @startChatting="startChatting(tutor)"
        >
          <p class="name">{{cardName(tutor.firstName, tutor.lastName)}}</p>
          <div class="profile-items">
            <p class="profile-item">
              <work-icon :hoverExpand="false" :iconColor="iconColor"/>
              <span v-if="tutor.verifiedWorkEmail && tutor.companyId">
                {{getCompanyName(tutor.companyId)}}
                <span v-if="tutor.yearsOfExperience"> - {{tutor.yearsOfExperience}} yrs </span>
              </span>
              <span v-else>
                Not Verified
              </span>
            </p>
            <p v-if="tutor.linkedInProfile" class="profile-item">
              <linked-in-icon :hoverExpand="false" :iconColor="iconColor"/>
              <a :href="toLinkedIn(tutor.linkedInProfile)">{{tutor.linkedInProfile}}</a>
            </p>
            <p v-if="tutor.githubProfile" class="profile-item">
              <github-icon :hoverExpand="false" :iconColor="iconColor"/>
              <a :href="toGithub(tutor.githubProfile)">
                {{tutor.githubProfile}}
              </a>
            </p>
          </div>
        </profile-card>
      </div>
      <infinite-loading :identifier="params" @infinite="infiniteHandler">
        <div slot="no-more">
          <div :style="{marginTop:'4rem'}">
            <h6 class="my-2 text-muted">No more tutors</h6>
          </div>
        </div>
        <div slot="no-results">
          <div :style="{marginTop:'4rem'}">
            <h6 class="my-2 text-muted">No more tutors</h6>
          </div>
        </div>
      </infinite-loading>
    </div>
  </div>
</div>
</template>

<script>
import ChatIntroductionModal from '@/components/ChatIntroductionModal.vue';
import {LinkedInIcon, GithubIcon, WorkIcon} from '@/components/icons';
import {mapActions, mapGetters} from 'vuex';
import InfiniteLoading from 'vue-infinite-loading';
import ProfileCard from '@/components/ProfileCard';

export default {
  name: 'Tutors',
  components: {
    InfiniteLoading,
    ProfileCard,
    LinkedInIcon,
    GithubIcon,
    WorkIcon,
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
    ...mapGetters('listTutors', ['tutors', 'params']),
    ...mapGetters('companies', ['companies']),
  },
  methods: {
    ...mapActions('companies', ['getCompanies']),
    ...mapActions('listTutors', ['getTutors']),
    async infiniteHandler($state) {
      const newTutors = await this.getTutors({reset: false});
      if (newTutors.length) {
        $state.loaded();
      } else {
        $state.complete();
      }
    },
    startChatting(tutor) {
      this.chatClientId = tutor.id;
      this.showModal = true;
    },
    cancel() {
      this.showModal = false;
    },
    getCompanyName(companyId) {
      if (companyId in this.companies) {
        return this.companies[companyId]?.name;
      }
      return '';
    },
    toLinkedIn(shortenedLinkedIn) {
      return 'https://www.linkedin.com/' + shortenedLinkedIn;
    },
    toGithub(shortenedGithub) {
      return 'https://' + shortenedGithub;
    },
    getPhoto(client) {
      return client.photo || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQB8oKGDdE1XOkEAYG_Xmo3HObzakQbY4oHnQ&usqp=CAU'; //eslint-disable-line
    },
    cardName(firstName, lastName) {
      return firstName;
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
  async mounted() {
    await this.getCompanies();
  },
};
</script>


<style scoped>
.scrollable {
  overflow-y: auto;
  overflow-x: hidden;

  /* for Firefox */
  min-height:0%;
}

.wrapper-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, 30rem);
  justify-content: space-around;
}

.flex-container-column{
  flex-direction: column;
  display:flex;
  height:100%;
  flex-wrap: nowrap;
  margin-top:2rem;
}

.flex-item-grow{
  flex-grow: 1;
}

p {
  margin-bottom: 0;
}

.check-mark {
    display:inline-flex;
    vertical-align:top;
    color: var(--clr-success);
}

.profile-items{
  margin-top: 0.5rem;
  font-size: 0.8rem;
  line-height: 1.6;
}

.profile-item{
  margin-top:5px;
  color: var(--clr-gray-4);
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


.current-work {
  font-size: 0.9rem;
  letter-spacing: 1px;
}
</style>

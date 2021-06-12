<template>
<div class="flex-container-column h-100">
  <h3 class="ms-3 my-2 primary-color"> Tutors </h3>
  <div class="scrollable flex-item-grow pb-2">
    <div class="wrapper-grid">
      <div v-for="(tutor) in tutors" v-bind:key="tutor.id">
        <profile-card
          :img="getPhoto(tutor)"
          :routeTo="routeToProfile(tutor.id)"
        >
          <p class="name">{{cardName(tutor.firstName, tutor.lastName)}}</p>
          <div class="current-work">
            <p v-if="tutor.workTitle">
              {{tutor.workTitle}} <span v-if="tutor.yearsOfExperience"> - {{tutor.yearsOfExperience}} yrs </span>
            </p>
            <p v-if="tutor.verifiedWorkEmail && tutor.companyId">
              {{getCompanyName(tutor.companyId)}}
              <span class="material-icons check-mark">
                check_circle
              </span>
            </p>
            <p v-else>
              Not Verified
            </p>
          </div>
          <div class="external-profiles">
            <p><a v-if="tutor.linkedInProfile" :href="toLinkedIn(tutor.linkedInProfile)">
              <i class="fab fa-linkedin"></i> {{tutor.linkedInProfile}}
            </a></p>
            <p><a v-if="tutor.githubProfile" :href="toGithub(tutor.githubProfile)">
              <i class="fab fa-github"></i> {{tutor.githubProfile}}
            </a></p>
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
import {mapActions, mapGetters} from 'vuex';
import InfiniteLoading from 'vue-infinite-loading';
import ProfileCard from '@/components/ProfileCard';

export default {
  name: 'Tutors',
  components: {
    InfiniteLoading,
    ProfileCard,
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
  grid-template-columns: repeat(auto-fit, 20rem);
}

.flex-container-column{
  flex-direction: column;
  display:flex;
  height:100%;
  flex-wrap: nowrap;
}

.flex-item-grow{
  flex-grow: 1;
}

.name {
  font-weight: bold;
  font-size: 1.5rem;
  color: var(--clr-gray-2)
}

p {
  margin-bottom: 0;
}

.check-mark {
    display:inline-flex;
    vertical-align:top;
    color: var(--clr-success);
}

.external-profiles{
  margin-top: 0.5rem;
  font-size: 0.8rem;
  line-height: 1.6;
}

.current-work {
  font-size: 0.9rem;
  letter-spacing: 1px;
}
</style>

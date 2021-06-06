<template>
<div class="flex-container-column h-100">
  <h4 class="ml-4 my-2"> Tutors </h4>
  <div class="scrollable flex-item-grow pb-2">
    <div class="wrapper-grid">
      <div v-for="(tutor) in tutors" v-bind:key="tutor.id">
        <card-wrapper>
          <profile-image v-bind:src="getTutorPhoto(tutor)"/>
          <name>{{name(tutor.firstName, tutor.lastName)}}</name>
          <work-verification v-if="tutor.verifiedWorkEmail && tutor.companyId">
            {{getCompanyName(tutor.companyId)}} <span class="material-icons">check_circle</span>
          </work-verification>
          <work-verification v-else>
            Not Verified
          </work-verification>
          <router-link class="stretched-link text-decoration-none" :to="routeToTutor(tutor.id)">
            <button class='btn'>Profile</button>
          </router-link>
        </card-wrapper>
      </div>
      <infinite-loading :identifier="params" @infinite="infiniteHandler">
        <div slot="no-more">
          <div class="card">
            <h6 class="my-2 text-muted">No more tutors</h6>
          </div>
        </div>
        <div slot="no-results">
          <div class="card">
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
import {
  CardWrapper,
  ProfileImage,
  Name,
  WorkVerification,
} from '@/components/style/ClientCard';

export default {
  name: 'Tutors',
  components: {
    InfiniteLoading,
    CardWrapper,
    ProfileImage,
    Name,
    WorkVerification,
  },
  computed: {
    ...mapGetters('listTutors', ['tutors', 'params']),
    ...mapGetters('companies', ['companies']),
  },
  methods: {
    ...mapGetters('companies', ['getCompanies']),
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
    getTutorPhoto(client) {
      return client.photo || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQB8oKGDdE1XOkEAYG_Xmo3HObzakQbY4oHnQ&usqp=CAU'; //eslint-disable-line
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
    routeToTutor(id) {
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

.btn {
  width: 100%;
  border: none;
  font-size: 1rem;
  font-weight: bold;
  color: white;
  padding: 1rem;
  background-color: var(--clr-primary);
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
</style>

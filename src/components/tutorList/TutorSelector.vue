<template>
<div class="flex-container-column h-100">
  <h4 class="ml-4 my-2"> Tutors </h4>
  <div class="scrollable flex-item-grow pb-2">
    <div class="wrapper-grid">
      <div v-for="(tutor) in tutors" v-bind:key="tutor.id" class="card">
        <img v-bind:src="getTutorPhoto(tutor)" class="profile-img">
        <p class="name">{{name(tutor.firstName, tutor.lastName)}}</p>
        <div v-if="tutor.about">
          <p class="about">{{shortAbout(tutor.about)}}</p>
        </div>
        <div class="row">
          <span class="material-icons col">
              block
          </span>
          <div class="col">
            <p> Work Verification </p>
          </div>
        </div>
        <router-link class="stretched-link text-decoration-none" :to="routeToTutor(tutor.id)">
          <button class='btn'>Profile</button>
        </router-link>
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

export default {
  name: 'Tutors',
  components: {
    InfiniteLoading,
  },
  computed: {
    ...mapGetters('listTutors', ['tutors', 'params']),
  },
  methods: {
    ...mapActions('listTutors', ['getTutors']),
    async infiniteHandler($state) {
      const newTutors = await this.getTutors({reset: false});
      if (newTutors.length) {
        $state.loaded();
      } else {
        $state.complete();
      }
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
};
</script>


<style scoped>
.profile-img {
  width: 8rem;
  clip-path: circle(60px at center);
  margin-top: 2rem;
  margin-left: 1rem;
}

.clientProfile{
  min-height: 20vh;
}

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

.card {
  overflow: hidden;
  box-shadow: 0px 2px 8px 0px var(--clr-gray-light);
  background-color: white;
  border-radius: 1rem;
  position: relative;
  margin: 0.5rem;
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

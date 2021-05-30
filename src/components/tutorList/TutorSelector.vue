<template>
<div class="h-100">
  <div class="row">
    <div class="col">
      <h4 class="ml-4 my-2"> Tutors </h4>
    </div>
  </div>
  <div class="row tutorCardsMain mb-2">
    <div class="col mt-4 card-columns mx-3">
      <div v-for="(tutor) in tutors" v-bind:key="tutor.id" class="card">
        <router-link class="stretched-link text-decoration-none tutorProfile" :to="routeToTutor(tutor.id)">
          <img v-bind:src="tutor.photo"  class="card-img-top tutorPhoto">
          <div class="card-body  py-1 documentBody">
            <h6 class="card-title">{{name(tutor.firstName, tutor.lastName)}}</h6>
            <div class="card-text">
              <div v-if="tutor.about" class="row">
                <p class="col">{{shortAbout(tutor.about)}}</p>
              </div>
              <div class="row">
                <span class="material-icons col">
                    block
                </span>
                <div class="col">
                  <p> Work Verification </p>
                </div>
              </div>
            </div>
          </div>
        </router-link>
      </div>
      <infinite-loading :identifier="params" @infinite="infiniteHandler">
        <div slot="no-more">
          <div class="card">
            <div class="card-body">
              <h6 class="card-subtitle mb-2 text-muted">No more tutors</h6>
            </div>
          </div>
        </div>
        <div slot="no-results">
          <p> No tutors to show </p>
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
    ...mapGetters('tutors', ['tutors', 'params']),
  },
  methods: {
    ...mapActions('tutors', ['getTutors']),
    async infiniteHandler($state) {
      const newTutors = await this.getTutors({reset: false});
      if (newTutors.length) {
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
.tutorPhoto{
  height:10vh;
  padding:5px;
  width:100%;
}
.tutorProfile{
  min-height: 20vh;
}
.tutorCardsMain{
  overflow-y: scroll;
  max-height: 100%;
}
.card-columns {
  column-count: 4;
}
</style>

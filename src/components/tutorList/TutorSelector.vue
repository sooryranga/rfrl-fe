<template>
<div>
  <div class="row">
    <div class="col">
      <h4 class="ml-4 my-2"> Tutors </h4>
    </div>
  </div>
  <div v-if="tutors.length" class="mt-4 card-columns mx-3">
    <div v-for="(tutor) in tutors" v-bind:key="tutor.id" class="card">
      <div>
        <img v-bind:src="tutor.photo" class="tutorPhoto">
        <div class="card-body  py-1 documentBody">
          <h6 class="card-title">{{name(tutor.firstName, tutor.lastName)}}</h6>
          <p class="card-text">{{shortDescription(tutor.about)}}</p>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <p> No tutors to show </p>
  </div>
</div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';

export default {
  name: 'Tutors',
  computed: {
    ...mapGetters('tutors', 'tutors'),
  },
  data: function() {
    return {
      tutors: [],
    };
  },
  methods: {
    ...mapActions('tutors', ['getTutors']),
    name(firstName, lastName) {
      return firstName + ' ' + LastName[0];
    },
    shortAbout(about) {
      const i = about?.indexOf(' ', 60);

      if (!about) {
        return '';
      } else if (i) {
        return about.slice(0, i) + ' ...';
      } else {
        return about + ' ...';
      }
    },
  },
  async mounted() {
    await this.getTutors();
  },
};
</script>


<style scoped>
.tutorPhoto{
  height:12vh;
  padding:5px;
  width:100%;
}
</style>

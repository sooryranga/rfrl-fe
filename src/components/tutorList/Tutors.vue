<template>
  <div class="h-100 mt-3 container-xl mx-auto">
    <transition name="fade">
      <div v-if="tutorError" class="alert alert-danger fade-in" role="alert">
        {{tutorError}}
      </div>
      <div v-if="companyError" class="alert alert-danger fade-in" role="alert">
        {{companyError}}
      </div>
    </transition>
    <tutor-filter></tutor-filter>
    <tutor-selector></tutor-selector>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import TutorSelector from '@/components/tutorList/TutorSelector.vue';
import TutorFilter from '@/components/tutorList/TutorFilter.vue';

export default {
  name: 'Tutors',
  components: {
    'tutor-selector': TutorSelector,
    'tutor-filter': TutorFilter,
  },
  computed: {
    ...mapGetters('tutors', ['tutorError']),
    ...mapGetters('companies', ['companyError']),
  },
  methods: {
    ...mapActions('tutors', ['getTutors']),
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

<template>
  <div class="h-100 mt-3 mx-auto">
    <transition name="fade">
      <div v-if="tutorError" class="alert alert-danger fade-in" role="alert">
        {{tutorError}}
      </div>
      <div v-if="companyError" class="alert alert-danger fade-in" role="alert">
        {{companyError}}
      </div>
    </transition>
    <div class="row">
      <div class="col-3">
        <tutor-filter></tutor-filter>
      </div>
      <div class="col">
        <tutor-selector></tutor-selector>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
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
};
</script>


<style scoped>
.tutorPhoto{
  height:12vh;
  padding:5px;
  width:100%;
}
</style>

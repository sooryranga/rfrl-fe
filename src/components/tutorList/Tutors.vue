<template>
  <div>
    <tutor-filter></tutor-filter>
    <tutor-selector></tutor-selector>
  </div>
</template>

<script>
import {mapActions} from 'vuex';
import TutorSelector from '@/components/tutorList/TutorSelector.vue';
import TutorFilter from '@/components/tutorList/TutorFilter.vue';

export default {
  name: 'Tutors',
  components: {
    'tutor-selector': TutorSelector,
    'tutor-filter': TutorFilter,
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

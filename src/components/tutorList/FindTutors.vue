<template>
  <div class="container-xl mt-3 mx-auto">
    <transition name="fade">
      <div v-if="tutorError" class="alert alert-danger fade-in" role="alert">
        {{tutorError}}
      </div>
      <div v-if="companyError" class="alert alert-danger fade-in" role="alert">
        {{companyError}}
      </div>
    </transition>
    <div class="flex-container-row">
      <div id="tutor-filter" class="flex-item-shrink h-100">
        <tutor-filter></tutor-filter>
      </div>
      <div id="tutor-selector" class="flex-item-grow h-100">
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
    ...mapGetters('listTutors', ['tutorError']),
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
.flex-container-row{
  flex-direction: row;
  display:flex;
  height:100%;
  flex-wrap: nowrap;
}

#tutor-filter{
  min-width: 20rem;
}

.flex-item-grow{
  flex-grow: 1;
}
.flex-item-shrink{
  height:100%;
}
</style>

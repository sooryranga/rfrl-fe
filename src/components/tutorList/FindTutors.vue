<template>
  <div class="h-100">
    <transition name="fade">
      <div v-if="tutorError" class="alert alert-danger fade-in" role="alert">
        {{tutorError}}
      </div>
      <div v-if="companyError" class="alert alert-danger fade-in" role="alert">
        {{companyError}}
      </div>
    </transition>
    <div class="flex-container-row h-100">
      <div id="tutor-filter" class="flex-item-shrink h-100">
        <tutor-filter></tutor-filter>
      </div>
      <div id="tutor-selector" class="flex-item-grow h-100">
        <slot name="global-banner"/>
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

#tutor-selector{
  padding-right:2rem;
  padding-left:2rem;
}

.flex-item-grow{
  flex-grow: 1;
}
.flex-item-shrink{
  height:100%;
}
</style>

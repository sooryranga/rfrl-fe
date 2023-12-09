<template>
  <tutor-review-submission-modal
    v-if="showTutorReviewSubmissionModal"
    v-bind:tutorFirstName="firstPendingTutorReview.firstName"
    v-bind:tutorLastName="firstPendingTutorReview.lastName"
    v-bind:tutorId="firstPendingTutorReview.tutorId"
    v-on:closeEditor="close"
  />
</template>

<script>
import {mapGetters, mapActions} from 'vuex';
import TutorReviewSubmissionModal from './TutorReviewSubmissionModal.vue';

const GLOBAL_MODAL_ROUTES = new Set([
  'home',
  'profile',
  'about',
  'tutors',
  'questions',
]);

export default {
  components: {TutorReviewSubmissionModal},
  computed: {
    ...mapGetters(
        'tutorReview',
        ['showTutorReview', 'firstPendingTutorReview'],
    ),
    ...mapGetters('globalModal', ['showGlobalModal']),
    ableToShowGlobalModal() {
      return GLOBAL_MODAL_ROUTES.has(this.$route.name) && this.showGlobalModal;
    },
    showTutorReviewSubmissionModal() {
      return this.showTutorReview && this.ableToShowGlobalModal;
    },
  },
  data() {
    return {};
  },
  methods: {
    ...mapActions('tutorReview', ['getPendingTutorReview']),
    ...mapActions('globalModal', ['preventShowingGlobalModal']),
    async close() {
      await this.preventShowingGlobalModal();
    },
  },
  async mounted() {
    await this.getPendingTutorReview();
  },
};

</script>

<style>

</style>

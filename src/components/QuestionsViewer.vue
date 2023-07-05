<template>
  <div v-if="question" class="text-left">
    <p class="display-1"> {{ question.title }} </p>
    <p class="my-1"> Posted By : {{ question.poster }} </p>
    <p class="my-1"> Created At : {{ timeAgoFormat(question.createdDate) }} </p>
    <router-link
    class="btn btn-outline-dark shadow-none my-3"
    v-bind:to="`/user/${question.id}/calendar`">
    Schedule Session
    </router-link>
    <p class="text-large"> {{ question.description }}</p>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
import TimeAgo from 'javascript-time-ago';

const timeAgo = new TimeAgo('en-US');

export default {
  name: 'questions-viewer',
  props: {
    questionId: Number,
  },
  computed: {...mapGetters('questions', ['getQuestion'])},
  data: function() {
    return {
      question: null,
    };
  },
  methods: {
    timeAgoFormat: function(newDate) {
      return timeAgo.format(newDate);
    },
  },
  mounted: function() {
    this.question = this.getQuestion(this.questionId);
  },
};
</script>

<style>
.text-large {
  font-size: 120%;
}
</style>

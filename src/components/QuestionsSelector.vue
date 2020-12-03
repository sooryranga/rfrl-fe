<template>
  <div class="text-left">
    <div class="row mb-2">
      <div class="col-auto mr-auto my-auto">
        <div>
          <h4 class="m-0">Questions Asked Near You</h4>
          <p class="m-0">{{questions.length}} found</p>
        </div>
      </div>
      <div class="col-auto my-auto">
        <span class="material-icons md-36">
          add
        </span>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <div
          class="row"
          v-for="(question, index) in questions"
          v-bind:key="index">
          <div v-on:click="routeToQuestion(index)" class="col">
            <div class="border"
            v-bind:class="[index == questions.length ? 'border-top-0' : '']">
              <p class="m-0 h5">{{shortenTitle(question.title)}}</p>
              <p class="m-0">{{question.poster}}</p>
              <p class="m-0">
              <small>{{timeAgoFormat(question.createdDate)}} · {{question.applicants}} Applicants</small>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import en from 'javascript-time-ago/locale/en';
import TimeAgo from 'javascript-time-ago';

TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo('en-US');

export default {
  name: 'QuestionsSelector',
  props: {
    questions: Array,
  },
  methods: {
    shortenTitle: function(title) {
      if (title.length > 120) {
        const t = title.splice(0, 115);
        return t + '...';
      }
      return title;
    },
    timeAgoFormat: function(newDate) {
      return timeAgo.format(newDate);
    },
    routeToQuestion: function(index) {
      if (routeQuestionId?.toString() === this.questions[index].id.toString()) {
        return;
      }
      this.$router.push({
        params: {questionId: this.questions[index].id},
        query: this.$route.query,
      });
    },
  },
};
</script>

<style scroped>
/* Rules for sizing the icon. */
.material-icons.md-18 { font-size: 18px; }
.material-icons.md-24 { font-size: 24px; }
.material-icons.md-36 { font-size: 36px; }
.material-icons.md-48 { font-size: 48px; }

/* Rules for using icons as black on a light background. */
.material-icons.md-dark { color: rgba(0, 0, 0, 0.54); }
.material-icons.md-dark.md-inactive { color: rgba(0, 0, 0, 0.26); }

/* Rules for using icons as white on a dark background. */
.material-icons.md-light { color: rgba(255, 255, 255, 1); }
.material-icons.md-light.md-inactive { color: rgba(255, 255, 255, 0.3); }
.large-text {
  font-size: 120%;
}
</style>

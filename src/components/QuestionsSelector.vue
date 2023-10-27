<template>
  <div class="h-100" v-if="questions">
    <div class="row mb-2">
      <div class="col-auto mr-auto my-auto">
        <div>
          <h5 class="m-0">Questions Asked Near You</h5>
          <p class="m-0">{{questions.length}} found</p>
        </div>
      </div>
      <div class="col-auto my-auto" v-on:click="openEditor">
        <span class="material-icons md-36">
          add
        </span>
      </div>
    </div>
    <ul class="list-group list-group-flush border-top">
      <li class="list-group-item p-0"
        v-for="(question, index) in questions"
        v-bind:key="index">
        <div v-on:click="routeToQuestion(index)">
          <div>
            <p class="m-0 h6 px-0">{{shortenTitle(question.title)}}</p>
            <p class="m-0">{{question.from.firstName}} + {{question.from.lastName}}</p>
            <p class="m-0">
            <small>{{timeAgoFormat(question.createdAt)}} · {{question.applicants}} Applicants</small>
            </p>
          </div>
        </div>
      </li>
    </ul>
  </div>
  <div v-else>
    <div class="row">
      <p> No questions found </p>
    </div>
  </div>
</template>

<script>
import {mapActions} from 'vuex';
import en from 'javascript-time-ago/locale/en';
import TimeAgo from 'javascript-time-ago';

TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo('en-US');

export default {
  name: 'QuestionsSelector',
  data() {
    return {
      questions: [],
    };
  },
  methods: {
    ...mapActions(
        'questions',
        ['getQuestions', 'openEditor', 'selectQuestion'],
    ),
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
      const questionId = this.questions[index].id;
      this.selectQuestion(questionId);
      console.log(questionId);
      this.$router.replace({
        params: {questionId: questionId},
        query: this.$route.query,
      });
    },
  },
  async mounted() {
    this.questions = await this.getQuestions();
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

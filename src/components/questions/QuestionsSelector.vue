<template>
  <div class="h-100" v-if="questions">
    <div class="row mb-2" style="height:4rem;">
      <div class="col-auto me-auto">
        <div>
          <h4 class="m-0 primary-color">Questions</h4>
          <p class="m-0">{{questions.length}} found</p>
        </div>
      </div>
      <div class="col-auto" v-on:click="openEditor">
        <button class="no-styling-button">
          <span class="material-icons" id="add-question-button">
            add
          </span>
        </button>
      </div>
    </div>
    <ul class="list-group list-group-flush border-top">
      <li class="list-group-item p-0 question-item"
        style="height:6rem"
        v-for="(question, index) in questions"
        v-bind:key="index">
        <div v-on:click="routeToQuestion(index)">
          <div>
            <p class="m-0 h6 px-0 question-name">{{shortenTitle(question.title)}}</p>
            <p class="m-0 mb-4">{{question.from.firstName}} {{question.from.lastName[0]}}</p>
            <p class="m-0">
            <small>{{timeAgoFormat(question.createdAt)}} · {{question.applicants}} Applicants</small>
            </p>
          </div>
        </div>
      </li>
      <infinite-loading @infinite="infiniteHandler">
        <div slot="no-more">No more questions</div>
        <div slot="no-results">No results questions</div>
      </infinite-loading>
    </ul>
  </div>
  <div v-else>
    <div class="row">
      <p> No questions found </p>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import en from 'javascript-time-ago/locale/en';
import TimeAgo from 'javascript-time-ago';
import InfiniteLoading from 'vue-infinite-loading';


TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo('en-US');

export default {
  name: 'QuestionsSelector',
  components: {
    InfiniteLoading,
  },
  computed: {
    ...mapGetters('questions', ['questions']),
  },
  methods: {
    async infiniteHandler($state) {
      const newQuestions = await this.getQuestions(
          {getMore: true},
      );
      if (newQuestions.length) {
        $state.loaded();
      } else {
        $state.complete();
      }
    },
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
      this.$emit('selected');
      if (this.questions[index].id === this.$route?.params?.questionId) {
        return;
      }
      const questionId = this.questions[index].id;
      this.selectQuestion(questionId);

      this.$router.push({
        params: {questionId: questionId},
        query: this.$route.query,
      });
    },
  },
};
</script>

<style scroped>
#add-question-button{
  font-size:2rem;
  color: var(--clr-primary-lightest)
}

#add-question-button:hover{
  color: var(--clr-primary-dark)
}

.question-name{
  font-size: 1.1rem;
}
.question-item{
  cursor: pointer;
}
.question-item:hover .question-name{
  color: var(--clr-primary-dark)
}
</style>

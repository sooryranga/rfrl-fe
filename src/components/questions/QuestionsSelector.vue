<template>
  <div class="h-100" v-if="questions" id="question-selector">
    <div class="row" id="header-box">
      <div class="col-auto me-auto">
        <div>
          <h1 id="title">Questions</h1>
          <p>{{questions.length}} found</p>
        </div>
      </div>
      <div class="col-auto" v-on:click="openEditor" id="add-btn-container">
        <button class="no-styling-button">
          <add-icon :iconColor="'white'" id="add-question-btn"></add-icon>
        </button>
      </div>
    </div>
    <ul class="list-group list-group-flush border-top">
      <li class="list-group-item question-item"
        v-for="(question, index) in questions"
        v-bind:key="index">
        <div v-on:click="routeToQuestion(index)" class="question-container">
          <p class="h6 px-0 question-name">{{shortenTitle(question.title)}}</p>
          <p class="m-0 mb-4 question-client">{{question.from.firstName}} {{question.from.lastName[0]}}</p>
          <p class="m-0 question-meta">
          <small>{{timeAgoFormat(question.createdAt)}} · {{question.applicants}} Applicants</small>
          </p>
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
import {AddIcon} from '@/components/icons';

TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo('en-US');

export default {
  name: 'QuestionsSelector',
  components: {
    InfiniteLoading,
    AddIcon,
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

<style scoped>
#question-selector p {
  color: white;
}

#header-box{
  padding-top: 3.5rem;
}

#add-btn-container{
  width: 3.5rem;
  height:3.5rem;
  flex-direction: column;
  display:flex;
  flex-wrap: nowrap;
  justify-content:space-around;
  align-items: center;
}

#add-question-btn{
  font-size: 2.5rem;
}

#title{
  font-size: 3rem;
  font-weight: 400;
}

#question-selector{
  width:380px;
  background-color: var(--clr-primary);
  color: white;
  font-size:1.1rem;
  padding-left: 1rem;
  padding-right: 1.5rem;
}

#add-question-button{
  font-size:2rem;
  color: var(--clr-primary-lightest)
}

#add-question-button:hover{
  color: var(--clr-primary-dark)
}

.question-container{
  position: relative;
  height:100%;
}

.question-name{
  font-size: 1.1rem;
  font-weight: 400;
  margin: 0;
}

.question-meta{
  font-size: 0.8rem;
  font-weight: 300;
  margin: 0;
  position:absolute;
  bottom: 0;
}

.question-client{
  font-size: 0.8rem;
  font-weight: 300;
  margin: 0;
}

.question-item{
  cursor: pointer;
  background-color: rgba(0,0,0,0);
  height:8rem;
  border-color:white;
  padding-left: 0;
  padding-bottom: 0.3rem;
  padding-right: 0;
  padding-top: 0.3rem;
}
.question-item:hover{
  background-color: var(--clr-primary-light);
}
</style>

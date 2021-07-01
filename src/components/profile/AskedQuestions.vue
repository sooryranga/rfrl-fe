<template>
  <div id="asked-question-container">
    <h5 id="title" >Asked Questions</h5>
    <div id="asked-question" v-for="(question, index) in questions" v-bind:key="index">
      <p class="question-title">{{shorten(question.title, 60)}}</p>
      <button @click="askedButtonOnClick(question)" class="primary-btn primary-btn-light asked-button">
        {{askedButtonDescription}}
      </button>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
import {Question} from '@/api';

export default {
  name: 'asked-questions',
  props: {
    profileId: String,
  },
  data: function() {
    return {
      questions: [],
    };
  },
  computed: {
    ...mapGetters('profile', ['currentProfileId']),
    isLoggedInUser() {
      return this.currentProfileId === this.profileId;
    },
    askedButtonDescription() {
      return this.isLoggedInUser ? 'Resolve' : 'Schedule';
    },
  },
  methods: {
    shorten: function(text, length) {
      if (text.length > length) {
        return text.slice(0, length-5) + '...';
      }
      return text;
    },
    async resolve(question) {
      await Question.QuestionService.update(
          question.id,
          {resolved: true},
      );
    },
    schedule() {

    },
    async askedButtonOnClick(question) {
      if (this.currentProfileId) {
        return await this.resolve(question);
      }
      return await this.schedule(question);
    },
  },
  async mounted() {
    if (this.profileId) {
      this.questions = await Question
          .QuestionService.getQuestionsForUser(this.profileId);
    }
  },
};
</script>

<style scoped>
#title{
  font-size: 1.5rem;
  font-weight: 400;
  padding-bottom: 1rem;
}

.asked-button{
  width:100%;
  max-width: 15rem;
  padding-top:0.5rem;
  padding-bottom: 0.5rem;
}

.question-title{
  font-size: 1rem;
  color:white;
  font-weight: 300;
}

#asked-question{
  padding-bottom: 0.5rem;
}

#asked-question-container{
  padding-top:1rem;
}
</style>

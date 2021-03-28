<template>
  <div id="questions" class="p-2 my-1 bg-white">
    <div class="row mb-0">
      <div class="col">
        <h5 class=" my-2" >Asked Questions</h5>
      </div>
    </div>
    <div class="row pl-3 mb-1" v-for="(question, index) in questions" v-bind:key="index">
      <div class="col my-auto my-0 py-0">
        <div class="row">
          <button type="button" class="btn btn-link pl-0 h6 m-0">Q: {{shorten(question.title, 60)}}</button>
        </div>
        <div class="row">
          <p class="my-1 text-wrap text-justify">{{ shorten(question.text, 150) }} </p>
        </div>
        <div class="row my-0 py-0" id="questionTags">
          <div
            v-for="tag in question.tags"
            v-bind:key="tag.name"
            class="col-auto ml-0 pl-0">
            <button
              type="button"
              class="btn btn-outline-secondary btn-sm small">
              {{tag.name}}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {Question} from '@/api';

export default {
  name: 'asked-questions',
  props: {
    'profileId': String,
  },
  data: function() {
    return {
      'questions': [],
    };
  },
  methods: {
    shorten: function(text, length) {
      if (text.length > length) {
        return text.slice(0, length-5) + '...';
      }
      return text;
    },
  },
  async mounted() {
    this.questions = await Question
        .QuestionService.getQuestionsForUser(this.profileId);
  },
};
</script>

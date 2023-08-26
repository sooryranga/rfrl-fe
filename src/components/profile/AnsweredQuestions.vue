<template>
  <div v-if="profile && profile.isTutor" id="questions" class="p-2 my-1 bg-white">
    <div class="row mb-0">
      <div class="col">
        <h5 class=" my-2" >Answered Questions</h5>
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
import {mapGetters} from 'vuex';

export default {
  name: 'answered-questions',
  props: {
    'profileId': String,
  },
  data: function() {
    return {
      'questions': [],
      'profile': null,
    };
  },
  computed: {
    ...mapGetters('profile', ['currentProfile']),
  },
  methods: {
    shorten: function(text, length) {
      if (text.length > length) {
        return text.slice(0, length-5) + '...';
      }
      return text;
    },
  },
  mounted: function() {
    this.questions.push({
      title: 'Math question',
      text: 'What is 1+1?',
      tags: [{name: 'Math'}, {name: 'Calculus'}],
    });
    this.questions.push({
      title: 'Really long mmath question is here and is not afraid to flex ath question is here and is not afraid to flex',//eslint-disable-line
      text: "What does the graph look like in a square pde? and does it have to confine to a periodical nature, can it have asymptotes? Can you solve second order square pde without a computer simulation?", // eslint-disable-line
      tags: [{name: 'Math'}, {name: 'Calculus'}],
    });

    if (this.profileId === this.currentProfile.id) {
      this.profile = this.currentProfile;
    } else {
      this.profile = this.currentProfile;
    }
  },
};
</script>

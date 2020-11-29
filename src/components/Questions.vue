<template>
<div id="question-div" class="mt-3 w-75 mx-auto">
  <questions-editor></questions-editor>
  <questions-filter
  v-on:addTag="addTag"
  v-on:removeTag="removeTag"
  v-on:updateDatePosted="updateDatePosted"
  v-on:updateRemote="updateRemote"
  ></questions-filter>
  <div v-for="question of questions"  v-bind:key="question.title" class="row mt-5 card">
    <img class="card-img-top" alt="Card image cap">
    <div class="card-body">
      <h5 class="card-title">{{question.poster}}</h5>
      <p class="card-text">Some quick example text.</p>
    </div>
    <ul class="list-group list-group-flush">
      <li class="list-group-item">Cras justo odio</li>
      <li class="list-group-item">Dapibus ac facilisis in</li>
      <li class="list-group-item">Vestibulum at eros</li>
    </ul>
    <div class="card-body">
      <router-link class="card-link" v-bind:to="`/user/${question.id}/calendar`">Ask Question</router-link>
    </div>
  </div>
</div>
</template>

<script>
import {mapGetters} from 'vuex';
import QuestionsFilter from '@/components/QuestionsFilter.vue';

export default {
  name: 'Questions',
  components: {'questions-filter': QuestionsFilter},
  computed: mapGetters(['questions']),
  data: function() {
    return {
      tags: [],
      datePosted: 'any_time',
      remote: false,
    };
  },
  methods: {
    removeTag: function(tag) {
      const indx = tags.indexOf(tag);
      if (indx > -1) {
        this.tags.splice(index, 1);
      }
    },
    addTag: function(tag) {
      this.tags.push(tag);
    },
    updateRemote: function(isRemote) {
      this.remote = isRemote;
    },
    updateDatePosted: function(datePosted) {
      this.datePosted = datePosted;
    },
  },
};
</script>

<style>
#question-div{
  flex-direction: column;
  flex-grow: 1!important;
  overflow: auto;
  /* for Firefox */
  min-height: 0;
  flex: 0 1 auto!important;
}
</style>

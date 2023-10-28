<template>
  <div id="question-div" class="mt-3 container-xl mx-auto">
    <transition name="fade">
      <div v-if="error" class="alert alert-danger fade-in" role="alert">
        {{error}}
      </div>
    </transition>
    <questions-editor v-if="isEditorOpen"></questions-editor>
    <questions-filter
    class="mt-3"
    v-on:updateTag="updateTag"
    v-on:updatedAtPosted="updatedAtPosted"
    v-on:updateRemote="updateRemote"
    ></questions-filter>
    <div class="row h-100 w-100 mt-4">
      <div class="col-4">
        <questions-selector></questions-selector>
      </div>
      <div class="col ml-4">
        <questions-viewer></questions-viewer>
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import QuestionsFilter from '@/components/QuestionsFilter.vue';
import QuestionsEditor from '@/components/QuestionsEditor.vue';
import QuestionsSelector from '@/components/QuestionsSelector.vue';
import QuestionsViewer from '@/components/QuestionsViewer.vue';

export default {
  name: 'Questions',
  components: {
    'questions-filter': QuestionsFilter,
    'questions-selector': QuestionsSelector,
    'questions-viewer': QuestionsViewer,
    'questions-editor': QuestionsEditor,
  },

  computed: {
    ...mapGetters('questions', ['isEditorOpen', 'error']),
  },

  data: function() {
    return {};
  },
  methods: {
    ...mapActions('questions', ['getQuestions', 'selectQuestion']),
    updateTag: function(tags) {
      console.log(tags);
    },
    updateRemote: function(isRemote) {
      console.log(isRemote);
    },
    updatedAtPosted: function(datePosted) {
      console.log(datePosted);
    },
  },
  async beforeMount() {
    const questionID = this.$route.params?.questionId;
    if (questionID) {
      this.selectQuestion(parseInt(questionID));
    }

    await this.getQuestions();
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

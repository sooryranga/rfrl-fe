<template>
  <div class="h-100">
    <transition name="fade">

    </transition>
    <questions-editor v-if="isEditorOpen"></questions-editor>
    <div id="questions-container" class="w-100">
      <div
        id="questions-selector"
        ref="selectorContainer"
        v-bind:class="[showSelectorContainer ? 'display-on' : 'display-off']">
        <questions-selector @selected="showViewer"></questions-selector>
      </div>
      <div
        id="questions-viewer"
        ref="viewerContainer"
        v-bind:class="[showViewerContainer ? 'display-on' : 'display-off']">
        <slot name="global-banner">
          <div v-if="error" class="alert alert-danger fade-in" role="alert">
            {{error}}
          </div>
        </slot>
        <questions-viewer @goback="showSelector"/>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
import QuestionsEditor from '@/components/questions/QuestionsEditor.vue';
import QuestionsSelector from '@/components/questions/QuestionsSelector.vue';
import QuestionsViewer from '@/components/questions/QuestionsViewer.vue';

export default {
  name: 'Questions',
  components: {
    'questions-selector': QuestionsSelector,
    'questions-viewer': QuestionsViewer,
    'questions-editor': QuestionsEditor,
  },

  computed: {
    ...mapGetters('questions', ['isEditorOpen', 'error']),
  },

  data() {
    return {
      showViewerContainer: false,
      showSelectorContainer: true,
    };
  },
  methods: {
    updateTag(tags) {
      console.log(tags);
    },
    updateRemote(isRemote) {
      console.log(isRemote);
    },
    updatedAtPosted(datePosted) {
      console.log(datePosted);
    },
    showViewer() {
      this.showSelectorContainer = false;
      this.showViewerContainer =true;
    },
    showSelector() {
      this.showSelectorContainer = true;
      this.showViewerContainer =false;
    },
  },
};
</script>

<style scoped>
#questions-container{
  flex-direction: row;
  display:flex;
  height:100%;
  width:100%;
  flex-wrap: nowrap;
  justify-content: center;
}

#questions-selector{
  flex: 0 0 25rem;
}

#questions-viewer{
  flex: 2 1;
  max-width:100%;
  padding-right:2rem;
  padding-left:2rem;
}

@media (max-width: 900px) {
  #questions-selector{
    flex: 0 1 100%;
     padding-right: 0rem;
  }

  #questions-viewer{
    flex: 2 1;
    padding-right: 2rem;
    padding-left: 2rem;
    max-width:100%;
  }

  .display-on {
    display: block;
  }
  .display-off {
    display: none;
  }
}
</style>

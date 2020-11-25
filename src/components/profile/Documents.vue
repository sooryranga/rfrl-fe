<template>
  <div  id="localDocuments" class="shadow p-3 my-3 bg-white">
    <document-editor
      :documentprop="this.editingItem"
      v-if="editorOpen"
      v-on:saveEvent="saveEvent"
      v-on:cancelEvent="cancelEvent"
    ></document-editor>
    <div class="row">
      <div class="col">
        <h3 class="text-left ml-4 my-2"> Documents </h3>
      </div>
      <div class="col-2 mx-auto my-auto addHover">
        <button v-if="isLoggedInUser" v-on:click="add">
          <span class="btn btn-outline-light material-icons md-dark md-36">add</span>
        </button>
      </div>
    </div>
    <div v-if="localDocuments.length" class="mt-4 card-columns mx-3">
      <div v-for="(document, index) in localDocuments" v-bind:key="document.id" class="card">
        <div>
          <embed v-bind:src="document.src" class="documentEmbed">
          <div class="card-body text-left py-1 documentBody">
            <h5 class="card-title">{{document.name}}</h5>
            <p class="card-text">{{document.description}}</p>
          </div>
        </div>
        <div v-if="isLoggedInUser" class="documentEditor hover-to-show mt-1">
          <span v-on:click="edit(index)" class="material-icons md-dark btn-outline-light btn">create</span>
          <span class="material-icons md-dark btn-outline-light btn">drag_handle</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';
import {DOCUMENTS, ADD_DOCUMENT} from '@/constants.actions.js';
import DocumentEditor from '@/components/profile/DocumentsEditor.vue';
import {documentState} from '@/constants.state.js';


export default {
  name: 'document',
  components: {'document-editor': DocumentEditor},
  data: function() {
    return {
      'editorOpen': false,
      'localDocuments': [],
      'editingIndex': null,
      'editingItem': documentState(),
    };
  },
  props: {
    'profileId': String,
  },
  computed: {
    ...mapGetters('profile', ['currentProfile']),
    'isLoggedInUser': function() {
      return this.currentProfile.id == this.profileId;
    },
  },
  methods: {
    ...mapActions('profile', [DOCUMENTS, ADD_DOCUMENT]),
    'cancelEvent': function() {
      this.clearEditorState();
      this.editorOpen = false;
    },
    'clearEditorState': function() {
      this.editorDocument = documentState();
    },
    'add': function() {
      this.editingItem = documentState();
      this.editorOpen = true;
      this.editingIndex = null;
    },
    'edit': function(index) {
      this.editingIndex = index;
      this.editingItem = this.localDocuments[index];
      this.editorOpen = true;
    },
    'saveEvent': function(state) {
      this.editorOpen = false;
      this.saveItem(state);
    },
    'saveItem': function(state) {
      this[ADD_DOCUMENT]({
        index: this.editingIndex,
        newDocument: state,
      });

      if (this.editingIndex != null) {
        this.localDocuments[this.editingIndex] = state;
      } else {
        this.localDocuments.push(state);
      }

      this.clearEditorState();
    },
  },
  mounted: function() {
    if (this.isLoggedInUser) {
      if (this.currentProfile.documents.length == 0) {
        this[DOCUMENTS]();
      }
      this.localDocuments.push(...this.currentProfile.documents);
    }
  },
};
</script>

<style scoped>
.documentEmbed{
  height:12vh;
  padding:5px;
  width:100%;
}
#documentCard{
  width:30%;
}
.documentBody{
  height:12vh;
  overflow: scroll;
}
.hover-to-show
{
  visibility:hidden;
  opacity:0;
  transition:opacity 0.5s linear;
}

.card:hover>.hover-to-show
{
    display:block;
    visibility:visible;
    opacity:1;
}

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
</style>

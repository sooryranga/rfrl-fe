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
        <h4 class=" ml-4 my-2"> Documents </h4>
      </div>
      <div class="col-2 my-auto addHover">
        <span
          v-if="allowToSave"
          v-on:click="add"
          class="material-icons md-24 md-dark btn-outline-light btn"
        >add</span>
      </div>
    </div>
    <div v-if="localDocuments.length" class="mt-4 card-columns mx-3">
      <div v-for="(document, index) in localDocuments" v-bind:key="document.id" class="card">
        <div>
          <embed v-bind:src="document.src" class="documentEmbed">
          <div class="card-body  py-1 documentBody">
            <h6 class="card-title">{{document.name}}</h6>
            <p class="card-text">{{document.description}}</p>
          </div>
        </div>
        <div v-if="allowToSave" class="documentEditor hover-to-show mt-1">
          <span v-on:click="edit(index)" class="material-icons md-dark btn-outline-light btn">create</span>
          <span class="material-icons md-dark btn-outline-light btn">drag_handle</span>
        </div>
      </div>
    </div>
    <div v-else style="height:50px" class="w-100 mx-auto my-auto">
      <p>No documents to show</p>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';
import {DOCUMENTS, ADD_DOCUMENT} from '@/constants.actions.js';
import DocumentEditor from '@/components/DocumentsEditor.vue';
import {documentState} from '@/constants.state.js';
import {DocumentService} from '@/api/DocumentService.js';


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
    'sessionId': String,
  },
  computed: {
    ...mapGetters('profile', ['currentProfile']),
    'isLoggedInUser': function() {
      return this.currentProfile.id === this.profileId;
    },
    'isSessionDocuments': function() {
      return this.sessionId != null;
    },
    'allowToSave': function() {
      return this.isLoggedInUser || this.isSessionDocuments;
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
    'saveItem': async function(state) {
      if (isLoggedInUser) {
        await this[ADD_DOCUMENT]({
          index: this.editingIndex,
          newDocument: state,
        });
      } else {
        await DocumentService.postForSession(this.sessionId, state);
      }

      if (this.editingIndex != null) {
        this.localDocuments[this.editingIndex] = state;
      } else {
        this.localDocuments.push(state);
      }

      this.clearEditorState();
    },
  },
  mounted: async function() {
    if (this.isLoggedInUser) {
      if (this.currentProfile.documents.length === 0) {
        this[DOCUMENTS]();
      }
      this.localDocuments.push(...this.currentProfile.documents);
    } else if (this.sessionId) {
      const documents = [];
      try {
        documents.push(...DocumentService.getForSession(this.sessionId));
      } catch (error) {
        console.error(error);
        documents.push(...[
          {id: 14, name: 'Home work', type: 'application/pdf', src: 'https://www.w3.org/wai/er/tests/xhtml/testfiles/resources/pdf/dummy.pdf', description: 'my resume is super big and nastymy resume is super big and nastymy resume is super big and nastymy resume is super big and nastymy resume is super big and nastymy resume is super big and nasty'}, // eslint-disable-line
          {id: 15, name: 'Practice', type: 'image/jpeg', src: 'https://upload.wikimedia.org/wikipedia/commons/b/b6/image_created_with_a_mobile_phone.png', description: 'my grade report'}, // eslint-disable-line
          {id: 15, name: 'Home work2', type: 'image/jpeg', src: 'https://upload.wikimedia.org/wikipedia/commons/b/b6/image_created_with_a_mobile_phone.png', description: 'my grade report'}, // eslint-disable-line
        ]);
      }
      await this.localDocuments.push(
          ...documents,
      );
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

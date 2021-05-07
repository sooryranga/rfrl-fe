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
          <span v-on:click="deleteItem(document.id)" class="material-icons md-dark btn-outline-light btn">delete</span>
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
import DocumentEditor from '@/components/DocumentsEditor.vue';
import {documentState} from '@/constants.state.js';
import {Document} from '@/api';


export default {
  name: 'document',
  components: {'document-editor': DocumentEditor},
  data: function() {
    return {
      editorOpen: false,
      localDocuments: [],
      editingIndex: null,
      editingItem: documentState(),
    };
  },
  props: {
    profileId: String,
    sessionId: String,
  },
  computed: {
    ...mapGetters('profile', ['currentProfile']),
    isLoggedInUser() {
      return this.currentProfile.id === this.profileId;
    },
    isSessionDocuments() {
      return this.sessionId != null;
    },
    allowToSave() {
      return this.isLoggedInUser || this.isSessionDocuments;
    },
    refType() {
      if (this.profileId !== null) return 'client';
      return 'session';
    },
    refId() {
      if (this.profileId !== null) return this.profileId;
      return this.sessionId;
    },
  },
  methods: {
    ...mapActions('profile', ['addDocument']),
    cancelEvent() {
      this.clearEditorState();
      this.editorOpen = false;
    },
    clearEditorState() {
      this.editorDocument = documentState();
    },
    add() {
      this.editingItem = documentState();
      this.editorOpen = true;
      this.editingIndex = null;
    },
    edit(index) {
      this.editingIndex = index;
      this.editingItem = this.localDocuments[index];
      this.editorOpen = true;
    },
    saveEvent(state) {
      this.editorOpen = false;
      this.saveItem(state);
    },
    async deleteItem(id) {
      await Document.DocumentService.delete({id});
      this.localDocuments = this.localDocuments.filter((doc) => doc.id != id);
    },
    async saveItem({name, description, src, id}) {
      if (id != null) {
        const newDocument = await Document.DocumentService.put(
            {id, src, description, name},
        );
        this.$set(this.localDocuments, this.editingIndex, newDocument);
      } else {
        const ids = this.localDocuments.map((doc) => doc.id) || [];
        const newDocument = await Document.DocumentService.post(
            {src, name, description},
        );
        ids.push(newDocument.id);
        const documents = await Document.DocumentService.putOrder({
          refId: this.refId,
          refType: this.refType,
          documentIds: ids,
        });
        this.localDocuments = documents;
      }
      this.clearEditorState();
    },
  },
  async mounted() {
    const documents = await Document.DocumentService.getOrder({
      refId: this.refId,
      refType: this.refType,
    });
    this.localDocuments = documents;
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

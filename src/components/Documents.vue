<template>
  <div>
    <document-editor
      :documentprop="this.editingItem"
      v-if="editorOpen"
      v-on:saveEvent="saveEvent"
      v-on:cancelEvent="cancelEvent"
    ></document-editor>
    <div class="flex-container-column">
      <div id="left-container">
        <h4 id="title"> Documents </h4>
      </div>
      <div>
        <button class="no-styling-button primary-color" id="add-document" v-on:click="allowToSave">
          <add-icon :iconColor="'var(--clr-accent)'"/>
        </button>
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
          <button @click="edit(index)" class="btn-no-style">
            <edit-icon/>
          </button>
          <button class="btn-no-style">
            <drag-icon/>
          </button>
          <button v-on:click="deleteItem(document.id)" class="btn-no-style">
            <delete-icon/>
          </button>
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
import {AddIcon, EditIcon, DragIcon, DeleteIcon} from '@/components/icons/';


export default {
  name: 'document',
  components: {
    'document-editor': DocumentEditor,
    AddIcon,
    EditIcon,
    DragIcon,
    DeleteIcon,
  },
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
    ...mapGetters('profile', ['currentProfileId']),
    isLoggedInUser() {
      return this.currentProfileId === this.profileId;
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
.flex-container-column{
  flex-direction: row;
  display:flex;
  flex-wrap: nowrap;
}

#left-container{
  flex: 1 1;
}

#title{
  color: var(--clr-primary);
  font-size: 2rem;
  font-weight: 400;
}

#add-document{
  margin-left: auto;
  margin-right: auto;
  color: var(--clr-primary-lighter);
  font-size: 2rem;
}

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

.card-title{
  color: var(--clr-gray-2)
}

.card:hover>.hover-to-show
{
    display:block;
    visibility:visible;
    opacity:1;
}
</style>

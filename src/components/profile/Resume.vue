<template>
  <div>
    <resume-editor
      :documentprop="this.editingItem"
      v-if="editorOpen"
      v-on:saveEvent="saveEvent"
      v-on:cancelEvent="cancelEvent"
    ></resume-editor>
    <div class="flex-container-column">
      <div id="left-container">
        <h4 id="title"> Resume </h4>
      </div>
      <div>
        <button class="no-styling-button primary-color" id="add-resume" v-on:click="editOrAdd">
          <add-icon :iconColor="'var(--clr-accent)'"/>
        </button>
      </div>
    </div>
    <div v-if="resume">
      <pdf-viewer :src="resume.src"/>
    </div>
    <div v-else style="height:50px" class="w-100 mx-auto my-auto">
      <p>No Resume to Show</p>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';
import ResumeEditor from '@/components/profile/ResumeEditor.vue';
import {documentState} from '@/constants.state.js';
import {Document} from '@/api';
import {AddIcon} from '@/components/icons/';
import PDFViewer from '@/components/PDFViewer';

export default {
  name: 'resume',
  components: {
    'resume-editor': ResumeEditor,
    AddIcon,
    'pdf-viewer': PDFViewer,
  },
  data: function() {
    return {
      editorOpen: false,
      resume: null,
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
    editOrAdd() {
      this.editingItem = this.resume;
      if (this.resume === null) {
        this.editingItem = documentState();
      }
      this.editorOpen = true;
    },
    async saveEvent(state) {
      this.editorOpen = false;
      await this.saveItem(state);
    },
    async saveItem({src, id}) {
      if (id != null) {
        const newDocument = await Document.DocumentService.put(
            {
              id,
              src,
              name: 'resume',
              description: `${this.currentProfileId} - resume`,
            },
        );
        this.resume = newDocument;
      } else {
        const newDocument = await Document.DocumentService.post(
            {
              src,
              name: 'resume',
              description: `${this.currentProfileId} - resume`,
            },
        );
        await Document.DocumentService.putOrder({
          refId: this.refId,
          refType: 'client',
          documentIds: [newDocument.id],
        });
        this.resume = newDocument;
      }
      this.clearEditorState();
    },
  },
  async mounted() {
    const documents = await Document.DocumentService.getOrder({
      refId: this.refId,
      refType: 'client',
    });
    this.resume = documents.length > 0 ? documents[0] : null;
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

#add-resume{
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

#title{
  color: var(--clr-primary);
  font-size: 2rem;
  font-weight: 400;
}

.card:hover>.hover-to-show
{
    display:block;
    visibility:visible;
    opacity:1;
}
</style>

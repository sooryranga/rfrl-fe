<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLongTitle">Resume Edit</h5>
            <button v-on:click="cancel" type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body p-0">
            <file-drop
                v-model="files"
                :accept="supportedResumeTypes"
                :picker-trigger="filePickerTrigger"
                id="file-picker"
            >
                <template #content id="content">
                    <div v-if="hasFiles" key="__hasFiles__">
                        <div
                             v-for="file in files"
                             :key="file.name"
                             class="mb-3"
                        >
                            {{ file.name }}

                            <button
                              class="no-styling-button"
                              style="height:1.5rem; width: 1.5rem;"
                              @click="removeFile(file)">
                              <delete-icon style="font-size:1.2rem" :iconColor="'white'"/>
                            </button>
                        </div>
                    </div>

                    <p class="mb-1">
                        Drop files or
                        <button
                            type="button"
                            id="upload-button"
                            class="primary-btn primary-btn-light"
                            @click="filePickerTrigger = $event"
                        >
                            Upload
                        </button>
                    </p>
                </template>
            </file-drop>
          </div>
          <div class="modal-footer">
            <button type="button" v-on:click="cancel" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <button type="button" v-on:click="save" class="btn btn-primary">Save changes</button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import {mapGetters} from 'vuex';
import {documentRef} from '@/firestore';
import FileDrop from '@/components/FileDrop.vue';
import {DeleteIcon} from '@/components/icons';

export default {
  name: 'resume-editor',
  props: {
    documentprop: Object,
  },
  components: {
    FileDrop,
    DeleteIcon,
  },
  data() {
    return {
      filePickerTrigger: {},
      files: [],
      supportedResumeTypes: ['application/pdf'],
    };
  },
  computed: {
    ...mapGetters('profile', ['currentProfileId']),
    hasFiles() {
      return this.files.length > 0;
    },
  },
  methods: {
    removeFile(file) {
      this.files = this.files.filter((x) => x !== file);
    },
    async save() {
      // Save file to bucket and update src
      if (!this.files.length) return;

      const resume = this.files[0];

      const today = new Date();
      const dateStr = today.toISOString().replace(/\D/g, '');
      const snapshot = await documentRef
          .child(`${this.currentProfileId}-${dateStr}`)
          .put(resume);

      this.src = await snapshot.ref.getDownloadURL();


      this.$emit(
          'saveEvent',
          {
            id: this.documentId,
            src: this.src,
          },
      );
    },
    cancel() {
      console.log(this.files);
      this.$emit(
          'cancelEvent',
      );
    },
  },
  mounted() {
    this.documentId = this.documentprop.id;
  },
};
</script>

<style scoped>
#file-picker{
  width:100%;
  height:100%;
}

#file-picker #content{
  color:white;
}

#upload-button{
  padding-right: 2rem;
  padding-left: 2rem;
  padding-top:0.5rem;
  padding-bottom: 0.5rem;
}

.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: table;
  transition: opacity .3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}
</style>

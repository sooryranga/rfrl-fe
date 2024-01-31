<template>
  <transition name="modal">
    <div class="modal-mask ">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLongTitle">Document Edit</h5>
            <button v-on:click="cancel" type="button" class="no-styling-button" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-2">
                <p>Name</p>
              </div>
              <div class="col">
                <input class="w-100" v-model="name" placeholder="document name">
              </div>
            </div>
            <div class="row">
              <div class="col-2">
                <p>Description</p>
              </div>
              <div class="col">
                <textarea class="h-100 w-100" v-model="description" placeholder="add description"/>
              </div>
            </div>
            <div class="row">
              <div class="col-2">
                <p>File</p>
              </div>
              <div class="col">
                <input type="file" id="file" ref="file" v-on:change="handleFileUpload"/>
              </div>
            </div>
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

export default {
  name: 'document-editor',
  props: {
    documentprop: Object,
  },
  data() {
    return {
      documentId: null,
      type: null,
      description: null,
      name: null,
      src: null,
      file: '',
    };
  },
  computed: {
    ...mapGetters('profile', ['currentProfileId']),
  },
  methods: {
    handleFileUpload() {
      this.file = this.$refs.file.files[0];
    },
    async save() {
      // Save file to bucket and update src
      console.log(this.file);
      if (!this.file && !this.src) return;

      if (this.file) {
        const today = new Date();
        const dateStr = today.toISOString().replace(/\D/g, '');
        const snapshot = await documentRef
            .child(`${this.currentProfileId}-${dateStr}`)
            .put(this.file);

        this.src = await snapshot.ref.getDownloadURL();
      }

      this.$emit(
          'saveEvent',
          {
            id: this.documentId,
            name: this.name,
            description: this.description,
            src: this.src,
          },
      );
    },
    cancel() {
      this.$emit(
          'cancelEvent',
      );
    },
  },
  mounted() {
    this.documentId = this.documentprop.id;
    this.description = this.documentprop.description;
    this.name = this.documentprop.name;
    this.src = this.documentprop.src;
  },
};
</script>

<style scoped>
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

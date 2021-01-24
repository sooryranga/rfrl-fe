<template>
  <transition name="modal">
    <div class="modal-mask ">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLongTitle">Document Edit</h5>
            <button v-on:click="cancel" type="button" class="close" data-dismiss="modal" aria-label="Close">
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
import {documentState} from '@/constants.state.js';

export default {
  name: 'document-editor',
  props: {
    documentprop: Object,
  },
  data: function() {
    return {
      id: null,
      type: null,
      description: null,
      name: null,
      src: null,
      file: '',
    };
  },
  methods: {
    handleFileUpload: function() {
      this.file = this.$refs.file.files[0];
    },
    save: function() {
      // Save file to bucket and update src
      const state = documentState();
      state.name = this.name;
      state.description = this.description;
      state.src = this.src? this.src : 'https://cdn.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png'; // eslint-disable-line
      this.$emit(
          'saveEvent',
          state,
      );
    },
    cancel: function() {
      this.$emit(
          'cancelEvent',
      );
    },
  },
  mounted: function() {
    this.id = this.documentprop.id;
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
